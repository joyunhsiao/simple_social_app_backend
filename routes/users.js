const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const permission = require("../service/permission");

router.post("/register", usersControllers.register);
router.post("/login", usersControllers.login);
router.get("/", permission.isAuth, usersControllers.getUsers);
router.get("/user", permission.isAuth, usersControllers.getUser);

module.exports = router;
