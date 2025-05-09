const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
    rule: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
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
    },
    ResetPasswordToken: {
        type: String,
        required: false,
    },
    ResetPasswordTokenExpires: {
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

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const userCount = await this.constructor.countDocuments();
            // console.log(userCount);
            if (userCount === 0) {
                this.rule = 'admin';
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
})

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

userSchema.methods.createResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(16).toString("hex");
    console.log(resetToken);
    this.ResetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.ResetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
    console.log(this.ResetPasswordTokenExpires, this.ResetPasswordToken);

    return resetToken;
}

const UserModel = mongoose.model("UserModel", userSchema);

module.exports = UserModel;
