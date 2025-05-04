const { createClient } = require("redis");
const { REDIS_CONNECTION_URL } = require("./env.configuration");

const redisClient = createClient({
  url: REDIS_CONNECTION_URL,
});

redisClient.on("connect", () => {
  console.log("Redis client connected successfully!");
});
redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.connect();

module.exports = redisClient;
