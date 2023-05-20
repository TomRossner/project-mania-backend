const { addMessage } = require("../controllers/chats.controller");
const { updateSocketId, updateOnlineStatus, getUserBySocketId } = require('../controllers/members.controllers');

// Socket events listener
function listen(io) {
    io.on('connection', (socket) => {
    
        // Handle connection event
        socket.on('connection', async (data) => {
            console.log(`🔌 ${data.userName} is connected. User socket ID: ${socket.id}`);

            // Update socket id
            await updateSocketId(data.userId, socket.id);

            // Update online status to true
            await updateOnlineStatus(socket.id, true);

            // Broadcast online event
            socket.broadcast.emit('online', {...data, newSocketId: socket._id});
        });

        // Handle newMessage event
        socket.on('newMessage', async (data) => {
            await addMessage(data);
            socket.to(data.target_socket_id).to(socket.id).emit('newMessage', data);
        });

        // Handle typing event
        socket.on('typing', (data) => {
            socket.to(data.targetSocketId).emit('typing', {chatId: data.chatId, userId: data.userId});
        });

        // Handle notTyping event        
        socket.on('notTyping', (data) => {
            socket.to(data.targetSocketId).emit('notTyping', {chatId: data.chatId, userId: data.userId});
        });

        // Handle createChat event
        socket.on('createChat', (data) => {
            socket.to(data.targetSocketId).emit('createChat', {userId: data.userId, newChat: data.newChat});
        });

        // Handle offline event
        socket.on('offline', async ({userName, userId}) => {
            console.log('❌ Logged out: ', socket.id);
            
            // Update 'online' status to false and 'last_seen' property to current time
            await updateOnlineStatus(socket.id, false);

            // Emit offline event to other connected clients
            socket.broadcast.emit('offline', {userName, userId});
        });

        // Handle disconnect event
        socket.on('disconnect', async () => {
            console.log('❌ Disconnected: ', socket.id);
            
            // Get user with his socket_id
            const user = await getUserBySocketId(socket.id);

            // Update 'online' status to false and 'last_seen' property to current time
            await updateOnlineStatus(socket.id, false);

            if (user) {
                // Emit offline event to other connected clients
                socket.broadcast.emit('offline', {userName: `${user?.first_name} ${user?.last_name}`, userId: user?._id});
            }
        })
    })
}

// Exports
module.exports = {
    listen
}