const { Router } = require("express");
const { createPosition, getPosition, updatePosition, deletePosition } = require("../controller/position");

const router = Router();

router.post("/", createPosition);

router.get("/:investorId", getPosition);

router.put("/", updatePosition);

router.delete("/:investorId/:positionId", deletePosition);

module.exports = router;
