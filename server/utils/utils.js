const uuidv4 = require('uuid').v4;
const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

async function hash(password) {
    const hashedPW = await bcrypt.hash(password, 10);
    return hashedPW;
}

function generateObjectId(uid) {
    const hash = crypto.createHash('sha1').update(uid).digest().slice(0, 12);
    return mongoose.Types.ObjectId(hash);
}

function generatePassword() {
    return uuidv4();
}

async function comparePasswords(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
}


module.exports = {
    hash,
    generateObjectId,
    generatePassword,
    comparePasswords
}
