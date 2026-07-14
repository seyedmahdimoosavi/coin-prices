const { getAllAddresses, fetchCoin } = require('./coinGeckoService');
const cache = require('./cacheService');
const { mapToDto } = require('../utils/mapper');

const DELAY_MS = 5000;
const REFRESH_INTERVAL_MS = 8 * 60 * 1000;

const pendingRequests = new Map();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function refreshByAddress(address) {
  if (pendingRequests.has(address)) {
    return pendingRequests.get(address);
  }
  const promise = (async () => {
    try {
      const { getCoinId } = require('./coinGeckoService');
      const coinId = getCoinId(address);
      if (!coinId) return cache.get(address);

      const raw = await fetchCoin(coinId);
      // console.log("coinId: ", coinId)
      const dto = mapToDto(raw);
      // console.log(dto)
      cache.set(address, dto);
      return dto;
    } catch (error) {
      console.error(`[Scheduler] Failed to refresh ${address}: ${error.message}`);
      return cache.get(address);
    } finally {
      pendingRequests.delete(address);
    }
  })();

  pendingRequests.set(address, promise);
  return promise;
}

async function initialLoad() {
  const addresses = getAllAddresses();
  console.log('[Scheduler] Starting initial cache load...');

  for (let i = 0; i < addresses.length; i++) {
    await refreshByAddress(addresses[i]);
    if (i < addresses.length - 1) {
      await delay(DELAY_MS);
    }
  }

  console.log('[Scheduler] Initial cache load complete.');
}

async function periodicRefresh() {
  const addresses = getAllAddresses();
  for (let i = 0; i < addresses.length; i++) {
    await refreshByAddress(addresses[i]);
    if (i < addresses.length - 1) {
      await delay(DELAY_MS);
    }
  }
}

function startScheduler() {
  initialLoad().catch(err => {
    console.error('[Scheduler] Initial load failed:', err.message);
  });

  setInterval(() => {
    periodicRefresh().catch(err => {
      console.error('[Scheduler] Periodic refresh failed:', err.message);
    });
  }, REFRESH_INTERVAL_MS);
}

module.exports = { startScheduler, refreshByAddress };