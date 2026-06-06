package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/llm-stock-analysis/backend/models"
)

type StockService struct {
	BaseURL    string
	httpClient *http.Client
}

func NewStockService() *StockService {
	url := os.Getenv("AI_SERVICE_URL")
	if url == "" {
		url = "http://localhost:8000"
	}
	return &StockService{
		BaseURL:    url,
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

// FetchStockData retrieves actual data via the Python AI-service (which uses yfinance).
func (s *StockService) FetchStockData(symbol string, period string) (*models.StockData, error) {
	if period == "" {
		period = "1mo"
	}
	payload := map[string]string{"symbol": symbol, "period": period}
	jsonData, _ := json.Marshal(payload)

	resp, err := s.httpClient.Post(fmt.Sprintf("%s/stock-data", s.BaseURL), "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to reach Stock Data Service: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Stock Data Service returned status %d", resp.StatusCode)
	}

	var data models.StockData
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("failed to decode stock data: %v", err)
	}

	return &data, nil
}
