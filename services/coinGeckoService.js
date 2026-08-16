const ADDRESS_TO_ID = {
  "0x51af1e727a5a78f98b8c2918cd494ba132d46eda": "ethereum",
  "0xf27f345653a9cc97a06efbb6ca7a4c44526716cb": "binancecoin"
};

const BASE_URL = "https://api.coingecko.com/api/v3/coins";
const API_KEY = process.env.COINGECKO_API_KEY || "CG-W37XBtbNNLFsENLf6drDQkCk";

function buildUrl(coinId) {
  return `${BASE_URL}/${coinId}?localization=false&tickers=false&developer_data=true`;
}

function getCoinId(address) {
  return ADDRESS_TO_ID[address] || null;
}

function getAllAddresses() {
  return Object.keys(ADDRESS_TO_ID);
}

// updated fetchCoin function to include error handling and API key

async function fetchCoin(coinId) {
  const response = await fetch(buildUrl(coinId), {
    headers: {
      "x-cg-demo-api-key": API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  return response.json();
}

async function fetchChartData(coinId, days) {
  const url = `${BASE_URL}/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  const response = await fetch(url, {
    headers: { "x-cg-demo-api-key": API_KEY }
  });

  if (!response.ok) {
    throw new Error(`CoinGecko Chart API error: ${response.status}`);
  }

  return response.json();
}



module.exports = { getCoinId, getAllAddresses, fetchCoin, fetchChartData };