FROM ghcr.io/astral-sh/uv:python3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt

COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
