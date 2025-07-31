const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS izin ver
app.use(cors());

// Public klasörünü statik olarak sun
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.get('/api', async (req, res) => {
  const { cc, month, year, cvv, lid } = req.query;

  if (!cc || !month || !year || !cvv || !lid) {
    return res.status(400).json({ error: 'Eksik parametre' });
  }

  try {
    const apiUrl = `https://checkout-gw.prod.ticimax.net/payments/9/card-point?cc=${cc}&month=${month}&year=${year}&cvv=${cvv}&lid=${lid}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'API isteği başarısız oldu' });
  }
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
