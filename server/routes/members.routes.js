const express = require('express');
const MembersRouter = express.Router();
const {getAllUsers, getUserByEmail} = require('../controllers/members.controllers');

MembersRouter.post('/', getUserByEmail);
MembersRouter.get('/all', getAllUsers);

module.exports = MembersRouter;