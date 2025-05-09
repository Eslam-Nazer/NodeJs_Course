const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
            validator: function (value) {
                return value === this._confirmPassword;
            },
            message: "Passwords and confirmPassword do not match",
        },
        select: false,
    },
    // confirmPassword: {
    //   type: String,
    //   required: [true, "Confirm Password is required"],
    //   trim: true,
    //   validate: {
    //     validator: function (value) {
    //       return value === this.password;
    //     },
    //     message: "Passwords and confirmPassword do not match",
    //   },
    // },
    passwordChangedAt: {
        type: Date,
        required: false,
    }
});

userSchema
    .virtual("confirmPassword")
    .set(function (value) {
        this._confirmPassword = value;
    })
    .get(function () {
        console.log(this._confirmPassword);
        return this._confirmPassword;
    });

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    bcrypt.hash(this.password, 12).then((hashedPassword) => {
        this.password = hashedPassword;
        next();
    });
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangedAtTimeStamp = parseInt(this.passwordCHangedAt / 1000, 10);
        return JWTTimestamp >= this.passwordChangedAt;
    }
    return false;
}

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
