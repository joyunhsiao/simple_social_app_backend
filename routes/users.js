const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");

router.post("/register", usersControllers.register);

module.exports = router;
