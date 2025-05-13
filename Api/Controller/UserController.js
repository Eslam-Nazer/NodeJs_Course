const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const UserModel = require("../Model/UserModel");
const CustomErrors = require("../Utils/CustomErrors");
const jwt = require("jsonwebtoken");
const {request, response} = require("express");

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
};

const senderResponse = (user, statusCode, response) => {
    const token = signToken(user._id, user.password);

    response.status(statusCode).json({
        status: "success",
        token: token,
        data: {
            user,
        }
    })
};

exports.updatePassword = AsyncErrorHandler(async (request, response, next) => {
    // Get current user data from database
    const user = await UserModel.findById(request.user._id).select('+password');

    // Check if the current password is correct
    if (!(await user.comparePassword(request.body.currentPassword, user.password))) {
        return next(new CustomErrors("Invalid password", 401));
    }
    // if password is correct update password with new value
    user.password = request.body.password;
    user.confirmPassword = request.body.confirmPassword;
    await user.save();

    // Login user and send jwt
    senderResponse(user, 200, response);
});

exports.updateUser = AsyncErrorHandler(async (request, response, next) => {
    if (request.body.password || request.body.confirmPassword) {
        return next(new CustomErrors("You can not update password here", 400));
    }

    const filterRequestObj = filterRequest(request.body, 'name', 'email');
    const updateUser = await UserModel.findByIdAndUpdate(request.user._id, filterRequestObj, {
        runValidators: true,
        new: true
    });

    senderResponse(updateUser, 200, response);
});

const filterRequest = (object, ...allowFields) => {
    const newObject = {};
    Object.keys(object).forEach((property) => {
        if (allowFields.includes(property)) {
            newObject[property] = object[property];
        }
    });
    return newObject;
}