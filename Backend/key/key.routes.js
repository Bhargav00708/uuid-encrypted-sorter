const express = require('express');
const { generateKey } = require('./key.controller');

const router = express.Router();

router.post('/generate-key', generateKey);

module.exports = router;