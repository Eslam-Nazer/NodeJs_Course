const express = require("express");
const authController = require("../Controller/AuthController");
const router = express.Router();

router
  .route("/signup")
  .post(authController.userValidation, authController.signup);
router.route("/login").post(authController.loginValidate, authController.login);

module.exports = router;
