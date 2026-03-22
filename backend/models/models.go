package models

type StockData struct {
	Symbol      string  `json:"symbol"`
	Price       float64 `json:"price"`
	Volume      int64   `json:"volume"`
	Historical  []PricePoint `json:"historical"`
}

type PricePoint struct {
	Date  string  `json:"date"`
	Close float64 `json:"close"`
}

type AnalysisResponse struct {
	Symbol      string  `json:"symbol"`
	Price       float64 `json:"price"`
	RSI         float64 `json:"rsi"`
	Signal      string  `json:"signal"`
	Confidence  string  `json:"confidence"`
	Explanation string  `json:"explanation"`
	Sentiment   string  `json:"sentiment"`
	Volume      int64   `json:"volume"`
	Historical  []PricePoint `json:"historical"`
}

type AIRequestPayload struct {
	Symbol      string  `json:"symbol"`
	Price       float64 `json:"price"`
	Historical  []float64 `json:"historical"`
}
