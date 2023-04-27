const {User} = require('../models/user.model');
const ERROR_MESSAGES = require('../utils/errors');

// Get user by email
async function getUserByEmail(req, res) {
    try {
        const {email} = req.params;
        const user = await User.findOne({email: email}).select({password: 0, __v: 0});
        return res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.GET_USER_FAILED});
        throw new Error(error);
    }
}

// Get user by ID
async function getUserById(req, res) {
    try {
        const {id} = req.params;
        const user = await User.findOne({_id: id}).select({password: 0, __v: 0});
        return res.status(200).send(user);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.GET_USER_FAILED});
        throw new Error(error);
    }
}

// Get all users
async function getAllUsers(req, res) {
    try {
        const users = await User.find({});
        return res.status(200).send(users);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.GET_ALL_USERS_FAILED});
        throw new Error(error);
    }
}

// Send message
async function sendMessage(req, res) {
    try {
        const {message, to} = req.body;
        console.log(`Sending '${message}' to ${to}`);
        res.status(200).send("Message received!");
    } catch (error) {
        throw new Error(error);
    }
}

// Update user socket ID
async function updateSocketId(userId, socketId) {
    try {
        return await User.updateOne(
            {_id: userId},
            {$set: {socket_id: socketId.toString()}}
        );
    } catch (error) {
        throw new Error(error);
    }
}

// Exports
module.exports = {
    getUserByEmail,
    getAllUsers,
    sendMessage,
    getUserById,
    updateSocketId
}