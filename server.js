const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api', async (req, res) => {
  const { cc, month, year, cvv, lid } = req.body;

  if (!cc || !month || !year || !cvv || !lid) {
    return res.status(400).json({ error: 'Eksik parametre' });
  }

  const apiUrl = 'https://checkout-gw.prod.ticimax.net/payments/9/card-point';

  try {
    const response = await axios.post(apiUrl, {
      cc,
      month,
      year,
      cvv,
      lid
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('API hatası:', error.message);
    res.status(500).json({ error: 'API isteği başarısız oldu' });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
