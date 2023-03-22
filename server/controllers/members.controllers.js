const {User} = require('../models');

async function getUserByEmail(req, res) {
    try {
        console.log(req.params)
        const {email} = req.params;
        const user = await User.findOne({email: email});
        console.log(user)
        return res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: "Failed getting user"});
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find({});
        return res.status(200).send(users);
    } catch (error) {
        res.status(400).send({error: "Failed getting users"});
    }
}

module.exports = {
    getUserByEmail,
    getAllUsers
}