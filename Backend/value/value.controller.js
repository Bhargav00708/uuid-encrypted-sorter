const redisClient = require("../config/redisClient.configuration");
const forge = require("node-forge");

async function submitValue(req, res) {
  const { uuid, encryptedValue, hashedValue } = req.body;

  if (!uuid || !encryptedValue) {
    return res
      .status(400)
      .json({ message: "uuid and encryptedValue are required." });
  }

  const allKey = `values:${uuid}:all`;
  const uniqueKey = `values:${uuid}:unique`;

  const isMember = await redisClient.sIsMember(allKey, hashedValue);
  await redisClient.sAdd(allKey, hashedValue);

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
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  if (!privateKey) {
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
    decryptedNumbers = encryptedValues.map((enc) => {
      const encryptedBytes = forge.util.decode64(enc);
      const decrypted = privateKey.decrypt(encryptedBytes, "RSAES-PKCS1-V1_5");
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
