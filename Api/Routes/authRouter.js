const express = require("express");
const authController = require("../Controller/AuthController");
const AuthController = require("../Controller/AuthController");
const router = express.Router();

router
    .route("/signup")
    .post(authController.userValidation, authController.signup);
router.route("/login").post(authController.loginValidate, authController.login);
router.route('/forgetPassword').post(authController.forgetPassword);
router.route('/resetPassword/:token').post(AuthController.resetPassword);
router.route('/updatePassword').patch(AuthController.protected, AuthController.updatePassword);

module.exports = router;
