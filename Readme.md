
---

### 📄 `README.md`

```markdown
# 🔐 RSA Encrypted Value Submission System

This project demonstrates a secure flow of generating RSA keys, encrypting numeric values on the frontend using a public key, and submitting them to the backend for validation and storage using Redis. The main goal is to ensure uniqueness of encrypted values without decrypting them, until a final decryption step after a certain number of submissions.
```
## 📁 Folder Structure

├── Backend/       # Node.js backend with Redis integration
├── Frontend/      # Client-side logic (HTML + JS)
├── index.html     # Entry point for the frontend
└── README.md      # You're reading it 🙂

````

---

## 🚀 Features

- RSA key generation
- Public key sent to frontend
- Frontend encryption using public key
- Encrypted values submitted to backend
- Redis used to check for uniqueness (without decrypting)
- Final decryption and sorting using private key

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```
git clone <repo-url>
cd <repo-folder>
```

### 2. Backend Setup (Node.js)

```bash
cd Backend
npm install
npm start
````

### 3. Frontend Setup

Just open the `index.html` file in your browser:

```bash
open index.html
# or manually open it in browser
```

It includes:

* Input box for number (0.01 to 99.99)
* Button to generate public key and encrypt values

## 📦 Dependencies

### Backend

* `express`
* `redis`

### Frontend

* `Node forge`

---
