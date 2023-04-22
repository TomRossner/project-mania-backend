const {Chat} = require('../models/chat.model');
const {Message} = require('../models/message.model');

async function getChat(req, res) {
    try {
        const {userId, contactId} = req.body;

        const chat = await Chat.find(chat => chat.users.includes(userId && contactId));
        console.log(chat);
        
        return res.status(200).send(chat);
    } catch (error) {
        console.log(error);
        res.status(400).send({error: 'Could not find chat'});
        throw new Error(error);
    }
}

async function createChat(req, res) {
    try {
        const {userId, contactId} = req.body;

        const chatAlreadyExists = await Chat.find(chat => chat.users.includes(userId && contactId));

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
        console.log(error);
        res.status(400).send({error: 'Could not create chat'});
        throw new Error(error);
    }
}

async function deleteChat(req, res) {
    try {
        const {chatId} = req.body;

        await Chat.findByIdAndDelete({_id: chatId});

        return res.status(200).send('Successfully deleted chat');
    } catch (error) {
        console.log(error);
        res.status(400).send({error: 'Could not delete chat'});
        throw new Error(error);
    }
}

async function createMessage(values) {
    const {message, from, to} = values;

    const newMessage = await new Message({
        from,
        to,
        text: message
    }).save();

    return newMessage;
}

async function addMessage(req, res) {
    try {
        const {chatId, message, from, to} = req.body;

        const newMessage = await createMessage({from, to, message});

        const chat = await Chat.findByIdAndUpdate(
            {_id: chatId},
            {$set: {messages: [...this.messages, newMessage]}}
        );

        console.log(chat);

        return res.status(200).send('Successfully added new message');
        
    } catch (error) {
        console.log(error);
        res.status(400).send({error: 'Could not add message'});
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