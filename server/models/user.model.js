const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require('dotenv').config();

// User schema
const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    last_login: {type: Date, default: Date.now},
    notifications: {type: Array},
    admin: {type: Boolean, default: false},
    online: {type: Boolean, default: false},
    base64_img_data: {type: String, default: ""},
    img_url: {type: String, default: ""},
    header: {type: String, default: ""},
    socket_id: {type: String, default: ""}
}, {collection: 'users'})

// Generate Auth token
userSchema.methods.generateAuthToken = function() {
    
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        admin: this.admin
    }, process.env.JWT_SECRET);

    return token;
}

// User model
const User = mongoose.model("User", userSchema);

// Exports
module.exports = {
    User,
    userSchema
}