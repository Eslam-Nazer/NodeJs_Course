const express = require("express");
const AuthController = require("../Controller/AuthController");
const router = express.Router();
const UserController = require("../Controller/UserController");

router.route('/updatePassword').patch(AuthController.protected, UserController.updatePassword);
router.route('/updateUser').patch(AuthController.protected, UserController.updateUser);

module.exports = router