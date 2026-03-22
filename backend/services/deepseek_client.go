package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type DeepSeekClient struct {
	Model    string
	Endpoint string
}

func NewDeepSeekClient() *DeepSeekClient {
	// For Local Ollama, the default endpoint is usually http://host.docker.internal:11434/v1/chat/completions
	// when calling from within a Docker container.
	url := os.Getenv("OLLAMA_API_URL")
	if url == "" {
		url = "http://host.docker.internal:11434/v1/chat/completions"
	}
	
	model := os.Getenv("OLLAMA_MODEL")
	if model == "" {
		model = "deepseek-r1:7b" // Default local R1 model
	}
	
	return &DeepSeekClient{Model: model, Endpoint: url}
}

// GetFinalRecommendation summarizes indicators and sentiment using a Local Ollama model.
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
		// For Ollama v1 compatibility, we can leave response_format as json_object
		"response_format": map[string]string{"type": "json_object"},
		"stream": false,
	}

	jsonData, _ := json.Marshal(requestBody)
	req, err := http.NewRequest("POST", c.Endpoint, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
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

	// Parsing the 'choices[0].message.content' which is a JSON string
	choices, ok := result["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return nil, fmt.Errorf("unexpected response structure from Ollama: %v", result)
	}
	
	msg := choices[0].(map[string]interface{})["message"].(map[string]interface{})
	content := msg["content"].(string)

	var finalOutput map[string]interface{}
	if err := json.Unmarshal([]byte(content), &finalOutput); err != nil {
		return nil, fmt.Errorf("failed to parse reasoning content as JSON: %v. Content: %s", err, content)
	}

	return finalOutput, nil
}
