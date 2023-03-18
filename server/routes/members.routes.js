const express = require('express');
const MembersRouter = express.Router();
const {getAllUsers, getUserByEmail} = require('../controllers/members.controllers');

MembersRouter.post('/:email', getUserByEmail);
MembersRouter.get("/all", getAllUsers);

module.exports = MembersRouter;