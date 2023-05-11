// SOCKETS EVENTS

const { addMessage } = require("../controllers/chats.controller");
const { updateSocketId, updateOnlineStatus, getUserBySocketId } = require('../controllers/members.controllers');

function listen(io) {
    io.on('connection', (socket) => {
    
        socket.on('connection', async (data) => {
            console.log(`🔌 ${data.userName} is connected. User socket ID: ${socket.id}`);

            // Update socket id
            await updateSocketId(data.userId, socket.id);

            // Update online status
            await updateOnlineStatus(socket.id, true);

            // Broadcast online 
            socket.broadcast.emit('online', data);
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

        socket.on('offline', async ({userName, userId}) => {
            await updateOnlineStatus(socket.id, false);
            socket.broadcast.emit('offline', {userName, userId});
            console.log('❌ Disconnected: ', socket.id);
            // socket.disconnect(); // Do I need this?
        });

        socket.on('unload', async ({ userId }) => {
            await updateOnlineStatus(userId, false);
        });

        socket.on('closeBrowser', async () => {
            console.log('❌ Disconnected: ', socket.id);
            
            const user = await getUserBySocketId(socket.id);

            if (user) {
                // Broadcast offline
                socket.broadcast.emit('offline', {userName: `${user?.first_name} ${user?.last_name}`, userId: user?._id});
            }

            // Update online status
            // await updateOnlineStatus(socket.id, false); // This causes online status bugs in admins list
        });
    })
}

// Exports
module.exports = {
    listen
}