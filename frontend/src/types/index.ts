export interface PricePoint {
    date: string;
    close: number;
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
