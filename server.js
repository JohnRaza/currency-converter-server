require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: ['https://currency-converter-alpha-coral.vercel.app', 'http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 204
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

//default route
app.get("/", (req, res) => {
  // Serve the HTML file
  const filePath = path.join(__dirname, "helloworld.html");
  res.sendFile(filePath, (err) => {
    if (err) {
      // Handle error if file is not found or any other issue occurs
      console.error("Error sending file:", err);
      res.status(err.status || 500).send("Error serving the file.");
    }
  });
});

// Endpoint to get currency rates
app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;
  try {
    const response = await axios.get(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.API_KEY}&base_currency=${from}&currencies=${to}`
    );
    const rate = response.data.data[to];
    const convertedAmount = rate * amount;
    res.json({ convertedAmount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch currency data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
