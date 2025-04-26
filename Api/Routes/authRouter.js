const express = require("express");
const authController = require("../Controller/AuthController");
const router = express.Router();

router
  .route("/signup")
  .post(authController.userValidation, authController.signup);

module.exports = router;
