require("dotenv").config();

const env = process.env;

const PORT = Number(env.PORT) || 3000;
const REDIS_CONNECTION_URL = env.REDIS_CONNECTION_URL;

module.exports = {
    PORT,
    REDIS_CONNECTION_URL
}
