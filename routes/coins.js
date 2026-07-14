const express = require('express');
const router = express.Router();
const cache = require('../services/cacheService');
const { getCoinId, fetchCoin } = require('../services/coinGeckoService');
const { mapToDto } = require('../utils/mapper');
const { refreshByAddress } = require('../services/scheduler');

router.get('/:address', async (req, res) => {
  const address = req.params.address.toLowerCase();

  if (cache.has(address)) {
    return res.json(cache.get(address));
  }

  try {
    const dto = await refreshByAddress(address);
    if (dto) {
      return res.json(dto);
    }
    return res.status(404).json({ error: 'Address not found' });
  } catch (error) {
    return res.status(502).json({ error: 'Failed to fetch coin data' });
  }
});

module.exports = router;