const express = require('express');
const MembersRouter = express.Router();
const {getAllUsers, getUserByEmail} = require('../controllers/members.controllers');

MembersRouter.get('/:email', getUserByEmail);
MembersRouter.get("/all", getAllUsers);

module.exports = MembersRouter;