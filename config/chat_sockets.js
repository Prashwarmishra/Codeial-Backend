module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){
        console.log('Connection established successfully:', socket.id);

        socket.on('disconnect', function(){
            console.log('Socket connection disconnected...');
        });

        socket.on('join-room', function(data){
            console.log('room joining request recieved: ', data);
            socket.join(data.chatRoom);

            io.in(data.chatRoom).emit('user_joined', data.userEmail);
        });
        
    });
}