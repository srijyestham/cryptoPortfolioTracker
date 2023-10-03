const { Router } = require("express");
const { getTokens } = require("../controller/token");

const router = Router();

router.get("/", getTokens);

module.exports = router;
