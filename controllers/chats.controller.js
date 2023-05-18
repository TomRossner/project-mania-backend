const {Chat} = require('../models/chat.model');
const {Message} = require('../models/message.model');
const ERROR_MESSAGES = require('../utils/errors');

// Get chat which contains both user IDs
async function getChat(req, res) {
    try {
        const {userId, contactId} = req.body;
        
        const chat = await Chat.findOne({users: { $all: [userId, contactId]}}).select({__v: 0});
        
        return res.status(200).send(chat);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.FIND_CHAT_FAILED});
    }
}

// Get user chats
async function getUserChats(req, res) {
    try {
        const {userId} = req.body;

        const chats = await Chat.find({users: {$all: [userId]}});

        return res.status(200).send(chats);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.GET_USER_CHATS_FAILED})
    }
}

// Create new chat
async function createChat(req, res) {
    try {
        const {userId, contactId} = req.body;

        const chatAlreadyExists = await Chat.findOne({users: { $all: [userId, contactId] }});

        if (chatAlreadyExists) return;

        const newChat = {
            users: [
                userId,
                contactId
            ]
        };

        const chat = await new Chat(newChat).save();

        return res.status(200).send(chat);
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.CREATE_CHAT_FAILED});
    }
}

// Delete chat
async function deleteChat(req, res) {
    try {
        const {chatId} = req.body;

        await Chat.findByIdAndDelete({_id: chatId});

        return res.status(200).send('Successfully deleted chat');
    } catch (error) {
        res.status(400).send({error: ERROR_MESSAGES.DELETE_CHAT_FAILED});
    }
}

// Create new message
async function createMessage(values) {
    const {text, from, to} = values;

    const newMessage = await new Message({
        from,
        to,
        text
    }).save();

    return newMessage;
}

// Add new message to chat
async function addMessage(data) {
    try {
        const {chatId, text, from, to} = data;

        const newMessage = await createMessage({from, to, text});

        return await Chat.findOneAndUpdate(
            {_id: chatId},
            {$push: {messages: newMessage}},
            {new: true}
        );
    } catch (error) {
        throw new Error(error);
    }
}

// Exports
module.exports = {
    getChat,
    createChat,
    deleteChat,
    addMessage,
    createMessage,
    getUserChats
}