const chartCache = new Map();

function initAddress(address) {
  if (!chartCache.has(address)) {
    chartCache.set(address, {
      prices: {},
      market_caps: {},
      total_volumes: {}
    });
  }
}

function setData(address, type, days, data) {
  initAddress(address);
  chartCache.get(address)[type][days] = data;
}

// function getData(address, type, days) {
//   return chartCache.get(address)?.[type]?.[days] || null;
// }

function getData(address, type, days) {
  const data = chartCache.get(address)?.[type]?.[days];
  return data ?? [];
}

module.exports = { setData, getData };