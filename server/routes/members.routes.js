const express = require('express');
const MembersRouter = express.Router();
const {getAllUsers, getUserByEmail, getUserById} = require('../controllers/members.controllers');

MembersRouter.post('/get/email/:email', getUserByEmail); // Get user by email
MembersRouter.post('/get/id/:id', getUserById); // Get user by id
MembersRouter.get('/all', getAllUsers); // Get all users

// Export router
module.exports = MembersRouter;