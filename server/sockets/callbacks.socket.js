// SOCKET EVENTS CALLBACKS

const { addMessage } = require("../controllers/chats.controller");
const { updateSocketId } = require('../controllers/members.controllers');

// Connection event callback
async function connect(data) {
    console.log(`${data.userName} is connected. User socket ID: ${socket.id}`);
    await updateSocketId(data.userId, socket.id);
}

// New message event callback
async function newMessage(data) {
    await addMessage(data);
    socket.to(data.target_socket_id).to(socket.id).emit('newMessage', data);
}

// Typing event callback
function typing(data) {
    socket.to(data.targetSocketId).emit('typing', {chatId: data.chatId});
}

// Not typing event callback
function notTyping(data) {
    socket.to(data.targetSocketId).emit('notTyping', {chatId: data.chatId});
}

// Create chat event callback
function createChat(data) {
    socket.to(data.targetSocketId).emit('createChat', {userId: data.userId, newChat: data.newChat});
}

// Online event callback
function online(data) {
    socket.broadcast.emit('online', data);
}

// Offline event callback
function offline(data) {
    socket.broadcast.emit('offline', {userName: data.userName, userId: data.userId});
}

// Disconnect event callback
function disconnect(data) {
    console.log(`A user has disconnected`);
}


module.exports = {
    connect,
    newMessage,
    typing,
    notTyping,
    createChat,
    online,
    offline,
    disconnect
}