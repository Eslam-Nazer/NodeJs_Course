const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const UserModel = require("./../Model/UserModel");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");

exports.userValidation = [
  body("name").notEmpty().withMessage("Name is required").isString(),
  body("email").notEmpty().withMessage("Email is required").isEmail(),
  body("password").notEmpty().withMessage("Password is required").isString(),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .isString(),
  (request, response, next) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({
        status: "fail",
        requestedAt: request.requestAt,
        statusCode: 400,
        errors: errors.array().map((err) => ({
          msg: err.msg,
          param: err.param,
          path: err.path,
        })),
      });
    }
    next();
  },
];

exports.signup = AsyncErrorHandler(async (request, response, next) => {
  let user = await UserModel.create({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
  });

  const token = jwt.sign(
    { id: user._id, username: user.name },
    process.env.SECRET_STR,
    {
      expiresIn: process.env.LOGIN_EXPIRES,
    }
  );

  response.status(201).json({
    status: "success",
    requestedAt: request.requestAt,
    statusCode: 201,
    token: token,
    data: {
      user: user,
    },
  });
});
