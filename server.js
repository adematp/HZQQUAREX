const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/proxy', async (req, res) => {
  const { cc, month, year, cvv, lid } = req.query;
  try {
    const response = await axios.get(`https://checkout-gw.prod.ticimax.net/payments/9/card-point?cc=${cc}&month=${month}&year=${year}&cvv=${cvv}&lid=${lid}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'API isteği başarısız oldu' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy sunucu çalışıyor: http://localhost:${PORT}`);
});
