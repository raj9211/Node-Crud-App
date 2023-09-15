"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    v
                );
            },
            message: (props) => `${props.value} is not a valid Email-ID`,
        },
        required: [true, "Email-ID is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone: {
        type: String,
        default: "",
        required: [true, "Phone is required"],
    },
    role: {
        type: String,
        required: [true, "User role is required"],
        enum: {
            values: ["admin", "user"],
            message: "Role is either admin or user.",
        },
    },
    state: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: Date.now,
    },
},
    { collection: "users", timestamps: true }
);

UserSchema.index({ email: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
