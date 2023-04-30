// Sockets

const { addMessage } = require("../controllers/chats.controller");
const { updateSocketId, getUserById } = require('../controllers/members.controllers');
const { Message } = require("../models/message.model");

function listen(io) {
    io.on('connection', (socket) => {
    
        socket.on('connection', async (data) => {
            console.log(`${data.userName} is connected. User socket ID: ${socket.id}`);
            await updateSocketId(data.userId, socket.id);
        })

        socket.on('new-message', async (data) => {
            await addMessage(data);
            socket.to(data.target_socket_id).to(socket.id).emit('new-message', data);
        })

        socket.on('typing', async (data) => {
            socket.to(data.targetSocketId).emit('typing');
        })

        socket.on('not-typing', async (data) => {
            socket.to(data.targetSocketId).emit('not-typing');
        })

        socket.on('seen', async (data) => {
            const message = await Message.updateOne(
                {_id: data.messageId},
                {$set: {seen: true}},
                {new: true}
            )

            socket.to(data.targetSocketId).emit('seen');
        })

        socket.on('disconnect', (data) => {
            console.log(`${data.userName} has disconnected`);
        })
    })

}

// Exports
module.exports = {
    listen
}