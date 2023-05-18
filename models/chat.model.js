const mongoose = require('mongoose');
const { messageSchema } = require('./message.model');

// Chat schema
const chatSchema = new mongoose.Schema({
    created_at: {type: Date, default: Date.now},
    users: {type: [String]},
    messages: {type: [messageSchema]},
}, {collection: 'chats'});

// Chat model
const Chat = mongoose.model("Chat", chatSchema);

// Exports
module.exports = {
    Chat,
    chatSchema
}