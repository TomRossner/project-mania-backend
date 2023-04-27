// Sockets

const { addMessage } = require("../controllers/chats.controller");
const { updateSocketId } = require('../controllers/members.controllers');

function listen(io) {
    io.on('connection', (socket) => {
    
        socket.on('connection', async (data) => {
            console.log(`${data.userName} is connected. User socket ID: ${socket.id}`);
            await updateSocketId(data.userId, socket.id);
        })

        socket.on('message', async (data) => {
            await addMessage(data);
            socket.to(data.target_socket_id).emit('message', data);
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