const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/proxy", async (req, res) => {
  const { cc, month, year, cvv, lid } = req.body;

  const apiUrl = `https://checkout-gw.prod.ticimax.net/payments/9/card-point?cc=${cc}&month=${month}&year=${year}&cvv=${cvv}&lid=${lid}`;

  try {
    // 🟠 1. Deneme: domain-name header
    let response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "domain-name": "alisveris.ticimax.com", // Geçerli bir mağaza domaini olmalı
      },
    });

    let data = await response.json();

    // Eğer DOMAIN_NAME_IS_REQUIRED hatası varsa, 2. denemeye geç
    if (data.key === "DOMAIN_NAME_IS_REQUIRED") {
      // 🔵 2. Deneme: Origin header ile
      response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "Origin": "https://alisveris.ticimax.com",
        },
      });
      data = await response.json();
    }

    if (data.key === "DOMAIN_NAME_IS_REQUIRED") {
      // 🟢 3. Deneme: Referer header ile
      response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "Referer": "https://alisveris.ticimax.com/",
        },
      });
      data = await response.json();
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası", detay: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy sunucu çalışıyor: http://localhost:${PORT}`);
});
