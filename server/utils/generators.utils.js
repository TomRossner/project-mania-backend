const uuidv4 = require('uuid').v4;
const mongoose = require("mongoose");
const crypto = require("crypto");

// Generate ObjectId
function generateObjectId(uid) {
    const hash = crypto.createHash('sha1').update(uid).digest().slice(0, 12);
    return mongoose.Types.ObjectId(hash);
}

// Generate random password
function generatePassword() {
    return uuidv4();
}

// Exports
module.exports = {
    generateObjectId,
    generatePassword
}
