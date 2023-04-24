const {Chat} = require('../models/chat.model');
const {Message} = require('../models/message.model');
const mongoose = require('mongoose');

// Get chat which contains both user IDs
async function getChat(req, res) {
    try {
        const {userId, contactId} = req.body;

        const chat = await Chat.findOne({users: { $all: [userId, contactId] }});
        
        return res.status(200).send(chat);
    } catch (error) {
        res.status(400).send({error: 'Could not find chat'});
        throw new Error(error);
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
        res.status(400).send({error: 'Could not create chat'});
        throw new Error(error);
    }
}

// Delete chat
async function deleteChat(req, res) {
    try {
        const {chatId} = req.body;

        await Chat.findByIdAndDelete({_id: chatId});

        return res.status(200).send('Successfully deleted chat');
    } catch (error) {
        res.status(400).send({error: 'Could not delete chat'});
        throw new Error(error);
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
        console.log(chatId);
        const newMessage = await createMessage({from, to, text});

        // const findChat = await Chat.findOne({_id: chatId});
        const chat = await Chat.findOneAndUpdate(
            {_id: chatId},
            {$push: {messages: newMessage}},
            {new: true}
        );

        console.log(chat);

        // return res.status(200).send('Successfully added new message');
        
    } catch (error) {
        // res.status(400).send({error: 'Could not add message'});
        throw new Error(error);
    }
}

// Exports
module.exports = {
    getChat,
    createChat,
    deleteChat,
    addMessage,
    createMessage
}