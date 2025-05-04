const express = require("express");
const cors = require('cors');

const keyRoutes = require("./key/key.routes");
const valueRoutes = require("./value/value.routes");
const { PORT } = require("./config/env.configuration");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/keys", keyRoutes);
app.use("/values", valueRoutes);

try {
  app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
} catch (err) {
  console.log("Error starting server:", err);
}
