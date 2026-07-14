const { getAllAddresses, getCoinId, fetchChartData } = require('./coinGeckoService');
const chartCache = require('./chartCacheService');

const VALID_DAYS = ['1d', '7d', '30d', '90d', '365d'];
const DELAY_MS = 5000;
const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 5 minutes

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function refreshChartData(address) {
  const coinId = getCoinId(address);
  if (!coinId) return;

  for (const days of VALID_DAYS) {
    try {
      const data = await fetchChartData(coinId, days);
      chartCache.setData(address, 'prices', days, data.prices);
      chartCache.setData(address, 'market_caps', days, data.market_caps);
      chartCache.setData(address, 'total_volumes', days, data.total_volumes);
    } catch (error) {
      console.error(`[ChartScheduler] Failed ${address} - ${days}: ${error.message}`);
    }
    await delay(DELAY_MS);
  }
}

async function initialLoad() {
  const addresses = getAllAddresses();
  console.log('[ChartScheduler] Starting initial chart load...');

  for (let i = 0; i < addresses.length; i++) {
    await refreshChartData(addresses[i]);
  }

  console.log('[ChartScheduler] Initial chart load complete.');
}

function startChartScheduler() {
  initialLoad().catch(err => {
    console.error('[ChartScheduler] Initial load failed:', err.message);
  });

  setInterval(() => {
    initialLoad().catch(err => {
      console.error('[ChartScheduler] Periodic refresh failed:', err.message);
    });
  }, REFRESH_INTERVAL_MS);
}

module.exports = { startChartScheduler };