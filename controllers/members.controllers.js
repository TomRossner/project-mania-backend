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
    }
}

// Get user's online status
async function updateOnlineStatus(socketId, boolean) {
    try {
        return await User.updateOne(
            {socket_id: socketId},
            {$set: {online: boolean}},
            {new: true}
        );
    } catch (error) {
        throw new Error(error);
    }
}

// Get user by Socket ID
async function getUserBySocketId(socketId) {
    try {
        const user = await User.findOne({socket_id: socketId}).select({password: 0, __v: 0});
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

// Get all users
async function getAllUsers(req, res) {
    try {
        const users = await User.find({}).select({password: 0, __v: 0});
        return res.status(200).send(users);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.GET_ALL_USERS_FAILED});
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
    getUserById,
    updateSocketId,
    updateOnlineStatus,
    getUserBySocketId
}