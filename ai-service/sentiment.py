import yfinance as yf
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch

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

def fetch_real_stock_data(symbol: str) -> dict:
    """
    Fetches real-time and historical stock data using yfinance.
    """
    try:
        ticker = yf.Ticker(symbol)
        # Get historical data for the last 1 month for enough context (RSI requires 14+ periods)
        history = ticker.history(period="1mo")
        
        if history.empty:
            print(f"No history found for {symbol}")
            return None

        # Last closing price
        current_price = history["Close"].iloc[-1]
        volume = int(history["Volume"].iloc[-1])
        
        # Prepare historical price points
        historical_points = []
        for date, row in history.iterrows():
            historical_points.append({
                "date": date.strftime("%Y-%m-%d"),
                "close": float(row["Close"])
            })

        return {
            "symbol": symbol,
            "price": float(current_price),
            "volume": volume,
            "historical": historical_points
        }
    except Exception as e:
        print(f"Error fetching real stock data for {symbol}: {e}")
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
