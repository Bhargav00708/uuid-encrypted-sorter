const { v4: uuidv4 } = require("uuid");
const redisClient = require("../config/redisClient.configuration");
const { generateRSAKeyPair } = require("./key.utilities");

async function generateKey(req, res) {
  const uuid = uuidv4();
  const { publicKey, privateKey } = generateRSAKeyPair();

  await redisClient.set(`keys:${uuid}:public`, publicKey);
  await redisClient.set(`keys:${uuid}:private`, privateKey);

  res.json({ uuid, publicKey });
}

module.exports = {
  generateKey,
};
