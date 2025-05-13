const {body, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const UserModel = require("./../Model/UserModel");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const CustomErrors = require("../Utils/CustomErrors");
const bcrypt = require("bcryptjs");
const util = require("util");
const sendEmail = require("../Utils/EmailFeature");
const crypto = require("crypto");

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

const signToken = (id, username) => {
    let token;
    token = jwt.sign(
        {id: id, username: username},
        process.env.SECRET_STR,
        {
            expiresIn: process.env.LOGIN_EXPIRES,
        }
    );
    return token;
}

const senderResponse = (user, statusCode, response) => {
    const token = signToken(user._id, user.password);

    response.status(statusCode).json({
        status: "success",
        token: token,
        data: {
            user,
        }
    })
}

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

    senderResponse(user, 200, response);
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

exports.restrict = (...rule) => {
    return (request, response, next) => {
        if (rule.includes(request.user.rule)) {
            return next();
        }
        return next(new CustomErrors('You have not permitted ', 403));
    }
}

exports.forgetPassword = AsyncErrorHandler(async (request, response, next) => {
    // 1. GET USER BASED ON POSTED EMAIL
    const user = await UserModel.findOne({email: request.body.email});

    console.log(user);
    if (!user) {
        return next(new CustomErrors("Undefined this user this email not found. You can register", 404));
    }

    // 2. GENERATE A RANDOM RESET TOKEN
    const resetToker = await user.createResetPasswordToken();
    await user.save();

    // 3. SEND TOKEN TO USER VIA EMAIL
    const resetUrl = `${request.protocol}://${request.host}/api/users/resetPassword/${resetToker}`;
    let textMessage = `Use this link to reset password: ${resetUrl} \n\n remember this link available for 10 minutes `;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            text: textMessage,
        });
        response.status(200).json({
            status: "success",
            message: "Password reset link sent successfully to your email",
        })
    } catch (error) {
        user.passwordResetToken = undefined;
        user.ResetPasswordTokenExpires = undefined;
        user.save();
        return next(new CustomErrors(`There was an error with email ${error.message}`, 500));
    }
});

exports.resetPassword = AsyncErrorHandler(async (request, response, next) => {
    const token = crypto.createHash('sha256').update(request.params.token).digest('hex');
    const user = await UserModel.findOne({ResetPasswordToken: token, ResetPasswordTokenExpires: {$gt: Date.now()}})

    if (!user) {
        const error = new CustomErrors("Invalid token or token has ben expired", 403);
        next(error);
    }

    try {
        // console.log(request.body.password, request.body.confirmPassword)
        user.password = request.body.password;
        user.confirmPassword = request.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.ResetPasswordTokenExpires = undefined;
        user.passwordChangedAt = Date.now();
    } catch (error) {
        next(new CustomErrors(`There was an error with email ${error.message}`, 500));
    }

    user.save();

    senderResponse(user, 200, response)
});

