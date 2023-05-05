// SOCKETS EVENTS

// const { connect, newMessage, typing, notTyping, createChat, online, offline, disconnect } = require("./callbacks.socket");

const { addMessage } = require("../controllers/chats.controller");
const { updateSocketId } = require('../controllers/members.controllers');

function listen(io) {
    io.on('connection', (socket) => {
    
        socket.on('connection', async (data) => {
            console.log(`${data.userName} is connected. User socket ID: ${socket.id}`);
            await updateSocketId(data.userId, socket.id);
        });

        socket.on('newMessage', async (data) => {
            await addMessage(data);
            socket.to(data.target_socket_id).to(socket.id).emit('newMessage', data);
        });

        socket.on('typing', (data) => {
            socket.to(data.targetSocketId).emit('typing', {chatId: data.chatId});
        });

        socket.on('notTyping', (data) => {
            socket.to(data.targetSocketId).emit('notTyping', {chatId: data.chatId});
        });

        socket.on('createChat', (data) => {
            socket.to(data.targetSocketId).emit('createChat', {userId: data.userId, newChat: data.newChat});
        });

        socket.on('online', (data) => {
            socket.broadcast.emit('online', data);
        });

        socket.on('offline', (data) => {
            socket.broadcast.emit('offline', {userName: data.userName, userId: data.userId});
        });

        // socket.on('seen', async (data) => {
        //     const message = await Message.updateOne(
        //         {_id: data.messageId},
        //         {$set: {seen: true}},
        //         {new: true}
        //     )

        //     socket.to(data.targetSocketId).emit('seen');
        // })

        socket.on('disconnect', (data) => {
            console.log(`A user has disconnected`);
        });
    })

}

// Exports
module.exports = {
    listen
}