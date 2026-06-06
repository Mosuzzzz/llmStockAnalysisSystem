package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

type DeepSeekClient struct {
	Model      string
	Endpoint   string
	httpClient *http.Client
}

func NewDeepSeekClient() *DeepSeekClient {
	url := os.Getenv("OLLAMA_API_URL")
	if url == "" {
		url = "http://localhost:11434/v1/chat/completions"
	}

	model := os.Getenv("OLLAMA_MODEL")
	if model == "" {
		model = "deepseek-r1:7b"
	}

	return &DeepSeekClient{
		Model:      model,
		Endpoint:   url,
		httpClient: &http.Client{Timeout: 120 * time.Second},
	}
}

// GetFinalRecommendation summarizes indicators and sentiment using a local Ollama model.
func (c *DeepSeekClient) GetFinalRecommendation(symbol string, price float64, rsi float64, ma float64, sentiment string, news string) (map[string]interface{}, error) {
	prompt := fmt.Sprintf(`
Analyze the following stock data for %s:
- Current Price: $%.2f
- RSI (14): %.2f
- Moving Average (20): %.2f
- Sentiment Analysis (FinGPT): %s

Context (Recent News):
%s

Tasks:
1. Provide a reasoning for your recommendation.
2. Output a concrete recommendation (BUY, SELL, or HOLD).
3. Suggest a confidence level (High/Medium/Low).
4. Return results ONLY in valid JSON format:
{
  "symbol": "%s",
  "rsi": %.2f,
  "signal": "BUY/SELL/HOLD",
  "confidence": "Level",
  "explanation": "concise reasoning here"
}
`, symbol, price, rsi, ma, sentiment, news, symbol, rsi)

	requestBody := map[string]interface{}{
		"model": c.Model,
		"messages": []map[string]string{
			{"role": "system", "content": "You are a professional financial assistant. Respond only in JSON."},
			{"role": "user", "content": prompt},
		},
		"response_format": map[string]string{"type": "json_object"},
		"stream":          false,
	}

	jsonData, _ := json.Marshal(requestBody)
	req, err := http.NewRequest("POST", c.Endpoint, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to reach local Ollama (is it running?): %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("Ollama API error (%d): %s", resp.StatusCode, string(body))
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return nil, fmt.Errorf("unexpected response structure from Ollama: %v", result)
	}

	firstChoice, ok := choices[0].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected choice structure from Ollama")
	}

	msg, ok := firstChoice["message"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected message structure from Ollama")
	}

	content, ok := msg["content"].(string)
	if !ok {
		return nil, fmt.Errorf("unexpected content type from Ollama")
	}

	// Strip DeepSeek-R1 <think>...</think> reasoning block before the JSON
	if idx := strings.Index(content, "</think>"); idx != -1 {
		content = content[idx+len("</think>"):]
	}

	// Trim to the first { ... last } to isolate the JSON object
	start := strings.Index(content, "{")
	end := strings.LastIndex(content, "}")
	if start == -1 || end == -1 || end < start {
		return nil, fmt.Errorf("no JSON object found in Ollama response: %s", content)
	}
	content = content[start : end+1]

	var finalOutput map[string]interface{}
	if err := json.Unmarshal([]byte(content), &finalOutput); err != nil {
		return nil, fmt.Errorf("failed to parse reasoning content as JSON: %v. Content: %s", err, content)
	}

	return finalOutput, nil
}
