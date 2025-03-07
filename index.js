require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT;

const connectDB = require("./src/config/db.config");
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
