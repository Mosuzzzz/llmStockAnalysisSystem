from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sentiment

app = FastAPI()

class SentimentRequest(BaseModel):
    symbol: str
    period: Optional[str] = "1mo"

class SentimentResponse(BaseModel):
    symbol: str
    sentiment: str
    news: str

class PricePoint(BaseModel):
    date: str
    close: float

class StockDataResponse(BaseModel):
    symbol: str
    price: float
    volume: int
    historical: List[PricePoint]

@app.post("/stock-data", response_model=StockDataResponse)
async def get_stock_data(request: SentimentRequest):
    try:
        print(f"DEBUG: AI Service received request for {request.symbol} with period: {request.period}")
        data = sentiment.fetch_real_stock_data(request.symbol, period=request.period)
        if not data:
            raise HTTPException(status_code=404, detail=f"Stock data not found for {request.symbol}")
        return data
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/news-sentiment", response_model=SentimentResponse)
async def get_sentiment(request: SentimentRequest):
    try:
        # Analyzes sentiment using FinGPT-style (FinBERT)
        result = sentiment.get_overall_sentiment(request.symbol)
        
        return SentimentResponse(
            symbol=request.symbol,
            sentiment=result["sentiment"],
            news=result["news"]
        )
    except Exception as e:
        print(f"Error getting sentiment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
