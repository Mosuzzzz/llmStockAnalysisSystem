package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type SentimentClient struct {
	BaseURL string
}

func NewSentimentClient() *SentimentClient {
	url := os.Getenv("AI_SERVICE_URL")
	if url == "" {
		url = "http://localhost:8000"
	}
	return &SentimentClient{BaseURL: url}
}

type SentimentResponse struct {
	Symbol    string `json:"symbol"`
	Sentiment string `json:"sentiment"`
	News      string `json:"news"`
}

// FetchSentiment calls the Python FastAPI service for FinGPT-style news sentiment.
func (c *SentimentClient) FetchSentiment(symbol string) (*SentimentResponse, error) {
	payload := map[string]string{
		"symbol": symbol,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(fmt.Sprintf("%s/news-sentiment", c.BaseURL), "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to reach Sentiment Service: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("Sentiment Service returned %d: %s", resp.StatusCode, string(body))
	}

	var result SentimentResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}
