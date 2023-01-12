
const express = require("express");

const router = express.Router();
const { getAllData } = require("../controllers/home.controller");

router.get("/allData", getAllData);

module.exports = router;