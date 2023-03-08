const bcrypt = require("bcrypt");

async function hash(password) {
    const hashedPW = await bcrypt.hash(password, 10);
    return hashedPW;
}

async function comparePasswords(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
}

module.exports = {
    hash,
    comparePasswords
}