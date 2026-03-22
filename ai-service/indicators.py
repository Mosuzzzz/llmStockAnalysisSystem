import pandas as pd
from ta.momentum import RSIIndicator
from ta.trend import SMAIndicator

def calculate_rsi(prices: list, window: int = 14) -> float:
    if len(prices) < window:
        return 50.0  # Default neutral
    df = pd.DataFrame(prices, columns=["close"])
    rsi = RSIIndicator(close=df["close"], window=window)
    rsi_series = rsi.rsi()
    # Get the last non-NaN value
    val = rsi_series.iloc[-1]
    if pd.isna(val):
        return 50.0
    return float(val)

def calculate_ma(prices: list, window: int = 20) -> float:
    if len(prices) < window:
        return prices[-1] if prices else 0.0
    df = pd.DataFrame(prices, columns=["close"])
    sma = SMAIndicator(close=df["close"], window=window)
    sma_series = sma.sma_indicator()
    val = sma_series.iloc[-1]
    if pd.isna(val):
        return prices[-1]
    return float(val)
