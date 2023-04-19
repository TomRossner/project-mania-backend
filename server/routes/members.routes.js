const express = require('express');
const MembersRouter = express.Router();
const {getAllUsers, getUserByEmail, sendMessage} = require('../controllers/members.controllers');

MembersRouter.post('/', getUserByEmail); // Get user by email
MembersRouter.get('/all', getAllUsers); // Get all users
MembersRouter.post('/send-message', sendMessage); // Send message

// Export router
module.exports = MembersRouter;