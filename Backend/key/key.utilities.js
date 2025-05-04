const forge = require("node-forge");

function generateRSAKeyPair() {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

  return {
    publicKey: publicKeyPem,
    privateKey: privateKeyPem,
  };
}

module.exports = { generateRSAKeyPair };
