const bcrypt = require("bcrypt");


// Hash password
async function hash(password) {
    // Salt
    const SALT = 10;

    // Hash password
    const hashedPW = await bcrypt.hash(password, SALT);

    return hashedPW;
}

// Compare passwords
async function comparePasswords(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
}

// Exports
module.exports = {
    hash,
    comparePasswords
}