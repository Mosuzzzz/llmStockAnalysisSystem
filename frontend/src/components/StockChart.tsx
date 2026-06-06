"use client";

import dynamic from "next/dynamic";
import { PricePoint } from "@/types";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StockChartProps {
  history: PricePoint[];
  symbol: string;
  currentPeriod: string;
  onPeriodChange: (period: string) => void;
}

const PERIOD_MAP: Record<string, string> = {
  "1D": "1d",
  "5D": "5d",
  "1M": "1mo",
  "6M": "6mo",
  "1Y": "1y",
  "5Y": "5y",
  "ALL": "max",
};

const PERIOD_LABELS: Record<string, string> = {
  "1d": "1 day", "5d": "5 days", "1mo": "1 month",
  "6mo": "6 months", "1y": "1 year", "5y": "5 years", "max": "all time",
};

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function StockChart({ history, symbol, currentPeriod, onPeriodChange }: StockChartProps) {
  const dates = history.map((p) => p.date);
  const prices = history.map((p) => p.close);

  const options: any = {
    chart: {
      id: "stock-price-chart",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: !prefersReducedMotion,
        easing: "easeout",
        speed: 400,
      },
      background: "transparent",
      fontFamily: "inherit",
    },
    colors: ["#22c55e"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: dates,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280", fontWeight: 700, fontSize: "12px" },
        formatter: (val: number) => val.toFixed(0),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      borderColor: "#111",
      strokeDashArray: 4,
    },
    theme: { mode: "dark" },
    tooltip: {
      theme: "dark",
      x: { show: true },
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
        title: { formatter: () => "" },
      },
    },
  };

  const series = [{ name: "Price", data: prices }];
  const periodLabel = PERIOD_LABELS[currentPeriod] ?? currentPeriod;

  return (
    <div
      className="bg-[#0c0c0c] p-1 rounded-3xl border border-gray-900 shadow-2xl"
      role="figure"
      aria-label={`${symbol} price chart — ${periodLabel}`}
    >
      <div className="p-6 pb-2 flex items-center justify-between">
        <div
          className="flex items-center gap-1.5 p-1.5 bg-[#141414] rounded-xl border border-gray-800"
          role="group"
          aria-label="Select time period"
        >
          {Object.keys(PERIOD_MAP).map(label => (
            <button
              key={label}
              type="button"
              onClick={() => onPeriodChange(PERIOD_MAP[label])}
              aria-pressed={currentPeriod === PERIOD_MAP[label]}
              aria-label={`${PERIOD_LABELS[PERIOD_MAP[label]] ?? label} view`}
              className={`px-3 py-2 min-h-11 text-[10px] font-black uppercase tracking-widest cursor-pointer rounded-lg transition-colors ${
                currentPeriod === PERIOD_MAP[label] ? "bg-white text-black" : "text-gray-500 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Chart
        key={`${symbol}-${history.length}-${currentPeriod}`}
        options={options}
        series={series}
        type="area"
        height={400}
      />
    </div>
  );
}
