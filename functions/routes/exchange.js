const { Router } = require("express");
const { getExchanges } = require("../controller/exchange");

const router = Router();

router.get("/", getExchanges);

module.exports = router;
