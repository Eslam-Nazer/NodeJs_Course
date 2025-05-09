const {body, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const UserModel = require("./../Model/UserModel");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const CustomErrors = require("../Utils/CustomErrors");
const bcrypt = require("bcryptjs");
const util = require("util");

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
        {id: user._id, username: user.name},
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

exports.loginValidate = [
    body("email").notEmpty().withMessage("Email is required").isEmail(),
    body("password").notEmpty().withMessage("Password is required").isString(),
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

exports.login = AsyncErrorHandler(async (request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;

    const user = await UserModel.findOne({email}).select("+password");

    if (!user) {
        const error = new CustomErrors("User not found", 404);
        return next(error);
    }

    const match = await user.comparePassword(password);
    if (!match) {
        const error = new CustomErrors("Invalid credentials", 401);
        return next(error);
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.name,
        },
        process.env.SECRET_STR,
        {
            expiresIn: process.env.LOGIN_EXPIRES,
        }
    );

    return response.status(200).json({
        status: "success",
        requestedAt: request.requestAt,
        statusCode: 200,
        token: token,
        // user: user,
    });
});

exports.protected = AsyncErrorHandler(async (request, response, next) => {
    // 1. Read token & check if it exists
    const testToken = request.headers?.authorization;
    let token;
    if (testToken && testToken.startsWith("Bearer ")) {
        token = testToken.split(' ')[1];
    }

    if (!token) {
        return next(new CustomErrors("You are not unauthorized!", 401));
    }
    // 2. validate token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR, (decoded, error) => {
        if (error.name === "TokenExpiredError") {
            return next(new CustomErrors(error, 401));
        }
    });

    // 3. check if user exists
    const user = await UserModel.findById(decodedToken.id);
    if (!user) {
        next(new CustomErrors("You are not authorized! you can sign up", 401));
    }
    // 4. If the user changed password after the token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    if (isPasswordChanged) {
        return next(new CustomErrors('password has been changed. login again', 401));
    }

    // 5. Allow user to access route
    request.user = user;

    return next();
});
