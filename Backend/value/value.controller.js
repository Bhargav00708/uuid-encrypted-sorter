const redisClient = require("../config/redisClient.configuration");
const crypto = require("crypto");
async function submitValue(req, res) {
  const { uuid, encryptedValue } = req.body;

  if (!uuid || !encryptedValue) {
    return res
      .status(400)
      .json({ message: "uuid and encryptedValue are required." });
  }

  const allKey = `values:${uuid}:all`;
  const uniqueKey = `values:${uuid}:unique`;

  // Always push to 'all' list
  await redisClient.rPush(allKey, encryptedValue);

  // Check if already exists in unique set
  const isMember = await redisClient.sIsMember(uniqueKey, encryptedValue);

  let isUnique = false;
  if (!isMember) {
    await redisClient.sAdd(uniqueKey, encryptedValue);
    isUnique = true;
  }

  res.json({
    message: isUnique ? "Unique value stored" : "Duplicate value",
    isUnique,
  });
}
async function getSortedValue(req, res) {
  const { uuid } = req.params;

  const privateKeyPem = await redisClient.get(`keys:${uuid}:private`);
  if (!privateKeyPem) {
    return res
      .status(404)
      .json({ message: "Private key not found or expired" });
  }

  const encryptedValues = await redisClient.sMembers(`values:${uuid}:unique`);
  if (!encryptedValues || encryptedValues.length === 0) {
    return res.status(404).json({ message: "No unique values found" });
  }

  let decryptedNumbers = [];

  try {
    const privateKey = crypto.createPrivateKey({
      key: privateKeyPem,
      format: "pem",
      type: "pkcs1",
    });

    decryptedNumbers = encryptedValues.map((enc) => {
      const buffer = Buffer.from(enc, "base64");
      const decrypted = crypto.privateDecrypt(privateKey, buffer).toString();
      return parseFloat(decrypted);
    });

    decryptedNumbers.sort((a, b) => b - a);
  } catch (err) {
    console.error("Decryption error:", err);
    return res.status(500).json({ message: "Error during decryption." });
  }

  res.json({ sortedValues: decryptedNumbers });
}

module.exports = {
  submitValue,
  getSortedValue,
};
