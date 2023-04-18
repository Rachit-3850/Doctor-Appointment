const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter name"],
    },
    email: {
        type: String,
        required: [true, "Enter email"],
    },
    password: {
        type: String,
        required: [true, "Enter password"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isDoctor: {
        type: Boolean,
        default: false,
    },
    notifcation: {
        type: Array,
        default: [],
    },
    seennotification: {
        type: Array,
        default: [],
    },
});
const UserModels = mongoose.model("DocterUsers", userSchema);
module.exports = UserModels;
