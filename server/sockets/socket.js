// Sockets

function listen(io) {
    io.on('connection', (socket) => {
    
        socket.on('connection', (data) => {
          console.log(`${data.userName} is connected`);
        })
    })
}

// Exports
module.exports = {
    listen
}