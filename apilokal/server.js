const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3010;

app.use(cors());

let doorStatus = "off"; // Status awal

// Function untuk mengacak status pintu setiap 7 detik
setInterval(() => {
  doorStatus = Math.random() > 0.5 ? "on" : "off";
  console.log(`Status Pintu: ${doorStatus}`);
}, 7000);

// Endpoint untuk mendapatkan status pintu
app.get("/status", (req, res) => {
  res.json({ status: doorStatus });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
