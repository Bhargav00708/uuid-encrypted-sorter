const express = require("express");
const { submitValue, getSortedValue } = require("./value.controller");

const router = express.Router();

router.post("/submit-value", submitValue);
router.get("/sorted/:uuid", getSortedValue);

module.exports = router;
