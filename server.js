const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/proxy', async (req, res) => {
  const { cc, month, year, cvv, lid } = req.query;
  if (!cc || !month || !year || !cvv || !lid) {
    return res.status(400).json({ error: 'Eksik parametre' });
  }
  try {
    const resp = await fetch(`https://checkout-gw.prod.ticimax.net/payments/9/card-point?cc=${cc}&month=${month}&year=${year}&cvv=${cvv}&lid=${lid}`);
    const data = await resp.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.listen(PORT, () => console.log(`Proxy sunucusu ${PORT} portunda aktif`));
