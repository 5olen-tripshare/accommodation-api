require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const accommodationRoutes = require("./routes/accommodation.routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

app.use("/api/accommodations", accommodationRoutes);

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

console.log(
  "📂 Les fichiers sont servis depuis :",
  path.join(__dirname, "../uploads")
);

app.get("/", (req, res) => {
  res.send("Microservice accommodation is running...");
});

module.exports = app;
