const express = require('express');
const router = express.Router();
const { getCoinId } = require('../services/coinGeckoService');
const chartCache = require('../services/chartCacheService');

const VALID_DAYS = new Set(['1', '7', '30', '90', '365']);
const VALID_TYPES = new Set(['prices', 'market_caps', 'total_volumes']);


// i want to add a commit for deploy on vercel
router.get('/:address/:type/:days', (req, res) => {
  const { type, days } = req.params;
  const address = req.params.address.toLowerCase();

  if (!getCoinId(address)) {
    return res.status(404).json({ error: 'Address not found' });
  }

  if (!VALID_TYPES.has(type) || !VALID_DAYS.has(days)) {
    return res.status(400).json({ error: 'Invalid chart type or days' });
  }

  return res.json(chartCache.getData(address, type, `${days}d`));
});

module.exports = router;