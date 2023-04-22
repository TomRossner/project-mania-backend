const express = require('express');
const ChatsRouter = express.Router();
const AUTH_MW = require('../middlewares/auth.middleware');
const {getChat, createChat, deleteChat} = require('../controllers/chats.controller');

ChatsRouter.post('/get', AUTH_MW, getChat);
ChatsRouter.post('/create', AUTH_MW, createChat);
ChatsRouter.delete('/delete', AUTH_MW, deleteChat);

// Export router
module.exports = ChatsRouter;