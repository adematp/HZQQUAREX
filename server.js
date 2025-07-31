const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/api/maxipuan", async (req, res) => {
  const { cc, month, year, cvv, lid } = req.body;

  try {
    const response = await axios.get(
      `https://checkout-gw.prod.ticimax.net/payments/9/card-point`,
      {
        params: { cc, month, year, cvv, lid },
        headers: {
          "Content-Type": "application/json",
          "domain-name": "hzquarex.onrender.com", // 🔧 Önemli
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(500).json(error.response.data);
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
