const express = require('express');
const MembersRouter = express.Router();
const {getAllUsers, getUserByEmail, sendMessage} = require('../controllers/members.controllers');

MembersRouter.post('/', getUserByEmail);
MembersRouter.get('/all', getAllUsers);
MembersRouter.post('/send-message', sendMessage);

module.exports = MembersRouter;