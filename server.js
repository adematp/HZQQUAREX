const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.get('/api', async (req, res) => {
  const { cc, month, year, cvv } = req.query;
  const lid = req.query.lid || '45542'; // sabit lid

  if (!cc || !month || !year || !cvv) {
    return res.status(400).json({ error: 'Eksik parametre' });
  }

  const apiUrl = `https://checkout-gw.prod.ticimax.net/payments/9/card-point?cc=${cc}&month=${month}&year=${year}&cvv=${cvv}&lid=${lid}`;
  console.log(`İstek atılıyor: ${apiUrl}`); // log eklendi

  try {
    const response = await axios.get(apiUrl);
    console.log('API cevabı:', response.data); // log eklendi
    res.json(response.data);
  } catch (error) {
    console.error('API hatası:', error.message); // log eklendi
    res.status(500).json({ error: 'API isteği başarısız oldu' });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
