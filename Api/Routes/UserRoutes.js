const express = require("express");
const AuthController = require("../Controller/AuthController");
const router = express.Router();
const UserController = require("../Controller/UserController");

router.route('/updatePassword').patch(AuthController.protected, UserController.updatePassword);
router.route('/updateUser').patch(AuthController.protected, UserController.updateUser);
router.route('/deleteUser').delete(AuthController.protected, UserController.deleteUser);

module.exports = router