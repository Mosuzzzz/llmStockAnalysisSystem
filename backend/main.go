package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/llm-stock-analysis/backend/models"
	"github.com/llm-stock-analysis/backend/services"
)

var (
	stockSvc      *services.StockService
	sentimentSvc  *services.SentimentClient
	deepseekSvc   *services.DeepSeekClient
)

func init() {
	stockSvc = services.NewStockService()
	sentimentSvc = services.NewSentimentClient()
	deepseekSvc = services.NewDeepSeekClient()
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it. Using OS environment variables.")
	}

	router := gin.Default()

	// CORS Middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Serve Static Files
	// Inside Docker, they are in ./frontend
	router.Static("/ui", "./frontend")
	router.StaticFile("/", "./frontend/index.html")
	router.StaticFile("/styles.css", "./frontend/styles.css")
	router.StaticFile("/app.js", "./frontend/app.js")

	router.GET("/stock/:symbol", getStock)
	router.POST("/analyze", analyzeStock)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func getStock(c *gin.Context) {
	symbol := c.Param("symbol")
	period := c.DefaultQuery("period", "1mo")
	data, err := stockSvc.FetchStockData(symbol, period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, data)
}

func analyzeStock(c *gin.Context) {
	var body struct {
		Symbol string `json:"symbol"`
		Period string `json:"period"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if body.Period == "" {
		body.Period = "1mo"
	}

	// 1. Fetch stock data
	stockData, err := stockSvc.FetchStockData(body.Symbol, body.Period)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to fetch stock data: %v", err)})
		return
	}

	// Extract prices for indicators
	var prices []float64
	for _, p := range stockData.Historical {
		prices = append(prices, p.Close)
	}

	// 2. [Go] Calculate Technical Indicators (RSI, MA)
	indicators, err := services.CalculateIndicators(prices)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to calculate indicators: %v", err)})
		return
	}

	// 3. [Python] Fetch News Context and perform Sentiment analysis (FinGPT style)
	sentimentResult, err := sentimentSvc.FetchSentiment(body.Symbol)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to get Python sentiment: %v", err)})
		return
	}

	// 4. [DeepSeek-R1] Final Recommendation summarize Indicators + News Sentiment
	analysis, err := deepseekSvc.GetFinalRecommendation(
		body.Symbol,
		stockData.Price,
		indicators.RSI,
		indicators.MA,
		sentimentResult.Sentiment,
		sentimentResult.News,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to get DeepSeek reasoning: %v", err)})
		return
	}

	// 5. Response with consolidated analysis
	// Note: result map expected to have 'signal', 'confidence', 'explanation'
	c.JSON(http.StatusOK, models.AnalysisResponse{
		Symbol:      body.Symbol,
		Price:       stockData.Price,
		RSI:         indicators.RSI,
		Signal:      fmt.Sprintf("%v", analysis["signal"]),
		Confidence:  fmt.Sprintf("%v", analysis["confidence"]),
		Explanation: fmt.Sprintf("%v", analysis["explanation"]),
		Sentiment:   sentimentResult.Sentiment,
		Volume:      stockData.Volume,
		Historical:  stockData.Historical,
	})
}
