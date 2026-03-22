import yfinance as yf
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
import pandas as pd

# Using FinBERT (ProsusAI) which is very common and high performance for 'quick and cheap' finance sentiment.
# FinGPT-v3 (Llama2-13B) is the alternative but usually requires 24GB+ VRAM.
MODEL_NAME = "ProsusAI/finbert"

class SentimentAnalyzer:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SentimentAnalyzer, cls).__new__(cls)
            cls._instance._init_model()
        return cls._instance

    def _init_model(self):
        print(f"Loading sentiment model {MODEL_NAME}...")
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            self.model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
            self.nlp = pipeline("sentiment-analysis", model=self.model, tokenizer=self.tokenizer)
        except Exception as e:
            print(f"Error loading model: {e}")
            self.nlp = None

    def analyze(self, text: str) -> dict:
        if not self.nlp:
            return {"label": "neutral", "score": 0.0}
        
        # BERT has a 512 token limit, so we truncate
        results = self.nlp(text[:512])
        return results[0]

def fetch_news_headlines(symbol: str) -> list:
    """
    Fetches latest news headlines using yfinance.
    """
    try:
        ticker = yf.Ticker(symbol)
        news = ticker.news
        if not news:
            print(f"No news found for {symbol} via yfinance.")
            return []
            
        headlines = []
        for item in news[:5]: # Take top 5
            # Some versions of yfinance or certain symbols might have 'title' or 'heading' or similar.
            # Usually it's 'title', but we use .get() to be safe.
            title = item.get('title') or item.get('heading') or item.get('headline')
            if title:
                headlines.append(title)
        return headlines
    except Exception as e:
        print(f"Error fetching news for {symbol}: {e}")
        return []

def fetch_real_stock_data(symbol: str, period: str = "1mo"):
    """
    Fetches real-time and historical stock data using yfinance.
    """
    try:
        # Determine best interval for the given period
        # yf periods: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
        interval = "1d"
        if period == "1d":
            interval = "5m" # 5-min intervals for intraday
        elif period == "5d":
            interval = "15m" # 15-min intervals for 5 days
        
        data = yf.download(symbol, period=period, interval=interval)
        if data.empty:
            raise Exception(f"No data found for {symbol} with period {period}")
        
        # Flatten MultiIndex if present
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)

        # Get current price
        current_price = float(data['Close'].iloc[-1])
        volume = int(data['Volume'].iloc[-1])
        
        # Convert historical data for charting
        historical = []
        is_intraday = interval in ["5m", "15m", "1h"]
        for index, row in data.iterrows():
            date_str = index.strftime('%Y-%m-%d %H:%M') if is_intraday else index.strftime('%Y-%m-%d')
            historical.append({
                "date": date_str,
                "close": float(row['Close'])
            })
            
        return {
            "symbol": symbol,
            "price": current_price,
            "volume": volume,
            "historical": historical
        }
    except Exception as e:
        print(f"Error fetching real data: {e}")
        return None

def get_overall_sentiment(symbol: str) -> dict:
    analyzer = SentimentAnalyzer()
    headlines = fetch_news_headlines(symbol)
    
    if not headlines:
        return {"sentiment": "Neutral", "score": 0.0, "news": "No recent news found."}
    
    sentiments = []
    for h in headlines:
        s = analyzer.analyze(h)
        sentiments.append(s)
        print(f"FinBERT Analysis: '{h[:50]}...' -> {s['label']} (score: {s['score']:.2f})")
    
    # Simple average/majority vote
    labels = [s['label'] for s in sentiments]
    if not labels:
        return {"sentiment": "Neutral", "score": 0.0, "news": "No valid news to analyze."}
        
    final_sentiment = max(set(labels), key=labels.count)
    
    news_context = "\n".join([f"- {h}" for h in headlines])
    
    return {
        "sentiment": final_sentiment,
        "news": news_context
    }
