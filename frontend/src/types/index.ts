export interface PricePoint {
    date: string;
    close: number;
}

export interface StockData {
    symbol: string;
    price: number;
    volume: number;
    historical: PricePoint[];
}

export interface AnalysisResponse {
    symbol: string;
    price: number;
    rsi: number;
    signal: string;
    confidence: string;
    explanation: string;
    sentiment: string;
    volume: number;
    historical: PricePoint[];
}
