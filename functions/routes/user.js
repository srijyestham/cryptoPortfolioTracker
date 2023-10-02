const { Router } = require("express");
const { createUser } = require("../controller/user");

const router = Router();

router.post("/user", createUser);

module.exports = router;
