const express = require("express");

const app = express();
app.use(express.json());

const keyRoutes = require("./key/key.routes");
const valueRoutes = require("./value/value.routes");
const { PORT } = require("./config/env.configuration");

app.use("/keys", keyRoutes);
app.use("/values", valueRoutes);

try {
  app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
} catch (err) {
  console.log("Error starting server:", err);
}
