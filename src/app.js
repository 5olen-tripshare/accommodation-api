const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const accommodationRoutes = require("./routes/accommodation.routes");
const setupSwagger = require("./config/swagger.config");

const app = express();

app.use(cors());
app.use(bodyParser.json());

setupSwagger(app);

app.use("/api/accommodations", accommodationRoutes);

app.get("/", (req, res) => {
  res.send("Microservice accommodation is running...");
});

module.exports = app;
