import os
from openai import AsyncOpenAI
import json

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_explanation(context: dict) -> dict:
    """
    Constructs a prompt with technical context and news (RAG), 
    then calls OpenAI to generate an explanation and confidence level.
    """
    symbol = context["symbol"]
    rsi = context["rsi"]
    signal = context["signal"]
    price = context["price"]
    news = context["news"]

    prompt = f"""
    You are a professional financial analyst. Provide a concise explanation for the following stock data.
    
    Symbol: {symbol}
    Current Price: ${price:.2f}
    RSI (14-period): {rsi:.2f}
    Initial Rule-Based Signal: {signal}
    
    Relevant News/Context:
    {news}
    
    Tasks:
    1. Explain why the stock is showing a {signal} or potential trend shift based on technicals and context.
    2. Suggest a confidence level (High, Medium, Low).
    3. Return ONLY a JSON response in the format:
    {{
        "explanation": "concise insight here",
        "confidence": "High/Medium/Low"
    }}
    """

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": "You are a stock analysis assistant. Respond only in valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print(f"Error calling OpenAI: {e}")
        return {
            "explanation": f"Statistical analysis suggests a {signal} pattern but AI explanation failed: {str(e)}",
            "confidence": "Low"
        }
