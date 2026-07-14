const express = require('express');
const router = express.Router();
const { getCoinId } = require('../services/coinGeckoService');
const chartCache = require('../services/chartCacheService');

const VALID_DAYS = ['1d', '7d', '30d', '90d', '365d'];

router.get('/:type/:address/:days', (req, res) => {
  let { type, address, days } = req.params;

  address = address.toLowerCase();

  if (!VALID_DAYS.includes(days)) {
    days = '1d';
  }

  const coinId = getCoinId(address);
  if (!coinId) {
    return res.status(404).json({ error: 'Address not found' });
  }

  const data = chartCache.getData(address, type, days);

  if (data) {
    return res.json({ [days]: data });
  }

  return res.json({ [days]: [] });
});

module.exports = router;