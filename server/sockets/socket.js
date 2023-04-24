// Sockets

const { addMessage } = require("../controllers/chats.controller");

function listen(io) {
    io.on('connection', (socket) => {
    
        socket.on('connection', (data) => {
            console.log(`${data.userName} is connected`);
        })

        socket.on('message', async (data) => {
            console.log(data);
            await addMessage(data);
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