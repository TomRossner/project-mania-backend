const express = require('express');
const MembersRouter = express.Router();
const {getAllUsers, getUserByEmail} = require('../controllers/members.controllers');

MembersRouter.post('/:email', getUserByEmail);
MembersRouter.get("/users", getAllUsers);

module.exports = MembersRouter;