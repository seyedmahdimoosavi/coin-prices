const ADDRESS_TO_ID = {
  "0x51af1e727a5a78f98b8c2918cd494ba132d46eda": "ethereum",
  "0xf27f345653a9cc97a06efbb6ca7a4c44526716cb": "binancecoin",
  "0xd674ec6d370b5b6418679dcbc6a01aaedec93894": "shiba",
  "0x7d4a965754f800ea08b792b00455b31ed1c31fcc": "chainlink",
  "0xd68f57d9698088d5e0e6f49e60d1398a849098fd": "bitcoin",
  "0x711dc0dd81a4cca64bc8c3fad4e51d7eeb3082a7": "ethereum",
  "0x9c4229d652f0d0d7cadc11554abffa8c840798d8": "tether",
  "0xcc42fb0cf8bc9426e3165ee59dd8c6c19edf13b7": "usd-coin",
  "0xb1e600be9c665042ecaf99eb57857e54da4267d1": "dai",
  "0x89e23f72d7ea5d33d2b6d97bd63b6c08be7dbc7a": "pancakeswap-token",
  "0xe415faed7f43e22c8ef0159b33fadf577d94a5f0": "binancecoin"
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