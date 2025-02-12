const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const accommodationRoutes = require("./routes/accommodation.routes");
const setupSwagger = require("./config/swagger.config");

const app = express();

app.use(cors());
app.use(bodyParser.json());

setupSwagger(app);

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
