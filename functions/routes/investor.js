const { Router } = require("express");
const { createInvestor, deleteInvestor } = require("../controller/investor");

const router = Router();

router.post("/", createInvestor);

router.delete("/:investorId", deleteInvestor)

module.exports = router;
