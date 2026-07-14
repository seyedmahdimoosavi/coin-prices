const express = require('express');
const coinsRouter = require('./routes/coins');
const { startScheduler } = require('./services/scheduler');
const chartsRouter = require('./routes/charts'); // جدید
const { startChartScheduler } = require('./services/chartScheduler');

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.use('/api/coins', coinsRouter);
app.use('/api/charts', chartsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start scheduler (non-blocking)
startScheduler();
startChartScheduler();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;