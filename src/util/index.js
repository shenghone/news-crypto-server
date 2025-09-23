import dayjs from "dayjs";

export const calcDuration = (past, today) => {
  switch (past) {
    case "1d":
      return dayjs(today)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
    case "7d":
      return dayjs(today)
        .subtract(7, "day")
        .format("YYYY-MM-DD");
    case "1m":
      return dayjs(today)
        .subtract(1, "month")
        .format("YYYY-MM-DD");
    case "1y":
      return dayjs(today)
        .subtract(1, "year")
        .format("YYYY-MM-DD");
    default:
      return;
  }
};
export const getInterval = period => {
  switch (period) {
    case "1d":
      return "30m";
    case "7d":
      return "1h";
    case "1m":
      return "1d";
    case "1y":
      return "1d";
    default:
      return "7d";
  }
};

// Stablecoin symbols to exclude (case-insensitive)
export const STABLECOIN_SYMBOLS = new Set([
  'USDT', 'USDC', 'BUSD', 'TUSD', 'USDP', 'DAI', 'USDE', 'GUSD', 'PAX', 'USD',
  'FRAX', 'UST', 'USDD', 'EURS', 'BGBP', 'EURA', 'CNHT', 'XCHF', 'XSGD'
]);


export const mapSymbolToCoinpaprikaId = (symbol) => {
  const base = symbol.split('/')[0].toLowerCase();
  return `${base}-${base}`; // e.g., BTC -> btc-bitcoin (simplified; extend for other coins)
};

// Maps Coinpaprika coin ID to TwelveData symbol
export const mapCoinpaprikaIdToTwelveDataSymbol=(coinId)=> {
  if (!coinId || typeof coinId !== 'string') {
    throw new Error('Invalid Coinpaprika ID: must be a non-empty string');
  }

  // Split Coinpaprika ID (e.g., btc-bitcoin -> ['btc', 'bitcoin'])
  const [ticker] = coinId.split('-');
  
  if (!ticker) {
    throw new Error(`Invalid Coinpaprika ID format: ${coinId}. Expected format: ticker-name`);
  }

  // Return TwelveData symbol (e.g., BTC/USD)
  return `${ticker.toUpperCase()}/USD`;
}


// Maps Coinpaprika intervals to TwelveData intervals
export function mapCoinpaprikaIntervalToTwelveData(interval) {
  if (!interval || typeof interval !== 'string') {
    throw new Error('Invalid interval: must be a non-empty string');
  }

  const intervalMap = {
    '5m': '5min',
    '10m': null, // No direct match in TwelveData
    '30m': '30min',
    '1h': '1h',
    '6h': null, // No direct match
    '12h': null, // No direct match
    '1d': '1day',
    '7d': '1week',
    '14d': null, // No direct match
    '30d': '1month' // Closest match to monthly
  };

  const mappedInterval = intervalMap[interval];

  if (!mappedInterval && interval in intervalMap) {
    console.warn(`No direct TwelveData interval match for Coinpaprika interval: ${interval}`);
  } else if (!(interval in intervalMap)) {
    throw new Error(`Unsupported Coinpaprika interval: ${interval}. Supported: ${Object.keys(intervalMap).join(', ')}`);
  }

  return mappedInterval;
}