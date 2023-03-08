const uuidv4 = require('uuid').v4;
const mongoose = require("mongoose");
const crypto = require("crypto");

function generateObjectId(uid) {
    const hash = crypto.createHash('sha1').update(uid).digest().slice(0, 12);
    return mongoose.Types.ObjectId(hash);
}

function generatePassword() {
    return uuidv4();
}

module.exports = {
    generateObjectId,
    generatePassword
}
