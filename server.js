const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // ✅ frontend dosyası

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/proxy", async (req, res) => {
  try {
    const { cc, month, year, cvv, lid } = req.body;

    const response = await axios.get(`https://checkout-gw.prod.ticimax.net/payments/9/card-point`, {
      params: {
        cc,
        month,
        year,
        cvv,
        lid
      },
      headers: {
        "Content-Type": "application/json"
      }
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
