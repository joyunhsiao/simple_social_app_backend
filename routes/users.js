const express = require('express');
const router = express.Router();
const usersControllers = require("../controllers/users");

router.get('/', usersControllers.getUsers);

module.exports = router;
