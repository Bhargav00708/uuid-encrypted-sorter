const baseUrl = CONFIG.BASE_URL;
let publicKeyPem = null;
let uuid = null;

document
  .getElementById("generateKeyBtn")
  .addEventListener("click", async () => {
    try {
      const res = await fetch(`${baseUrl}/keys/generate-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      uuid = data.uuid;
      publicKeyPem = data.publicKey;

      document.getElementById("uuidDisplay").innerText = `UUID: ${uuid}`;
      showMessage("Key generated successfully");
    } catch (err) {
      showMessage("Failed to generate key");
      console.error(err);
    }
  });

document.getElementById("submitBtn").addEventListener("click", async () => {
  const numInput = document.getElementById("numberInput").value.trim();
  const num = parseFloat(numInput);

  if (isNaN(num) || num < 0.01 || num > 99.99) {
    return showMessage("Please enter a valid number between 0.01 and 99.99");
  }

  if (!publicKeyPem || !uuid) {
    return showMessage("Generate a key first!");
  }

  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const numBuffer = forge.util.createBuffer(num.toString(), "utf-8");
    const encrypted = publicKey.encrypt(
      numBuffer.getBytes(),
      "RSAES-PKCS1-V1_5"
    );
    const encryptedBase64 = forge.util.encode64(encrypted);

    const md = forge.md.sha256.create();  // You can also use sha512
    md.update(num.toString(), "utf8");

    const res = await fetch(`${baseUrl}/values/submit-value`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uuid,
        encryptedValue: encryptedBase64,
        hashedValue: md.digest().toHex()
      }),
    });

    const data = await res.json();
    showMessage(`${num} ${data.message}` || "Submitted!");
  } catch (err) {
    showMessage("Encryption or submission failed");
    console.error(err);
  }
});

function showMessage(msg) {
  document.getElementById("responseArea").innerText = msg;
}

document.getElementById("showFinalBtn").addEventListener("click", async () => {
  if (!uuid) return showMessage("Generate a key first!");

  try {
    const res = await fetch(`${baseUrl}/values/sorted/${uuid}`);
    const data = (await res.json()).sortedValues;

    if (!data || !Array.isArray(data)) {
      return showMessage("No result found or something went wrong");
    }

    showFinalResult(data);
  } catch (err) {
    showMessage("Failed to fetch final result");
    console.error(err);
  }
});

function showFinalResult(values) {
  const list = document.getElementById("finalResultList");
  list.innerHTML = "";

  values.forEach((val) => {
    const li = document.createElement("li");
    li.innerText = val;
    list.appendChild(li);
  });

  showMessage("Final sorted values displayed below");
}
