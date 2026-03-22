package services

import (
	"github.com/markcheno/go-talib"
)

type TechnicalIndicators struct {
	RSI float64
	MA  float64
}

// CalculateIndicators uses go-talib to calculate RSI and Moving Average (SMA).
func CalculateIndicators(prices []float64) (*TechnicalIndicators, error) {
	if len(prices) < 20 {
		return &TechnicalIndicators{RSI: 50.0, MA: 0.0}, nil
	}

	// RSI (14 period)
	rsiValues := talib.Rsi(prices, 14)
	rsi := rsiValues[len(rsiValues)-1]

	// SMA (20 period)
	maValues := talib.Sma(prices, 20)
	ma := maValues[len(maValues)-1]

	return &TechnicalIndicators{
		RSI: rsi,
		MA:  ma,
	}, nil
}
