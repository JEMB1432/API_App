const measurement = require("../controllers/measurement.controller");
const express = require("express");

const router = express.Router();

router.post("/history", measurement.createMeasurement);
router.get("/history", measurement.getHistory);
router.get("/history/all", measurement.getAllHistory);

module.exports = router;
