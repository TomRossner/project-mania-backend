const express = require('express');
const MembersRouter = express.Router();
const {getAllUsers, getUserByEmail, sendMessage, getUserById} = require('../controllers/members.controllers');

MembersRouter.post('/get/email/:email', getUserByEmail); // Get user by email
MembersRouter.post('/get/id/:id', getUserById); // Get user by id
MembersRouter.get('/all', getAllUsers); // Get all users
MembersRouter.post('/send-message', sendMessage); // Send message

// Export router
module.exports = MembersRouter;