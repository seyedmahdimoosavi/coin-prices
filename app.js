const express = require('express');
const coinsRouter = require('./routes/coins');
const { startScheduler } = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.use('/api/coins', coinsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start scheduler (non-blocking)
startScheduler();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;