const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', async (req, res) => {
  const { cc, month, year, cvv, lid } = req.query;

  if (!cc || !month || !year || !cvv || !lid) {
    return res.status(400).json({ error: 'Eksik parametre' });
  }

  const apiURL = `https://checkout-gw.prod.ticimax.net/payments/9/card-point?cc=${cc}&month=${month}&year=${year}&cvv=${cvv}&lid=${lid}`;

  try {
    const response = await axios.get(apiURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Content-Type': 'application/json',
        'Origin': 'https://ticimax.com',
        'Referer': 'https://ticimax.com'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('API hatası:', error.response?.data || error.message);
    res.status(500).json({
      error: 'API isteği başarısız oldu',
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
