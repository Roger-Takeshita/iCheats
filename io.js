//!Require Packages
   const io = require('socket.io')();
   let users = {};

//! Listen for new connections from clients (socket)
   io.on('connection', function(socket) {
      socket.on('new-user', function(user) {
         users[socket.id] = user;
         io.emit('update-user-list', Object.values(users));
      });
      socket.on('new-msg', function(data) {
         io.emit('new-msg', data);
      });
      socket.on('disconnect', function() {
         delete users[socket.id];
         io.emit('update-user-list', Object.values(users));
      });
   });

//! Export socket.io
   module.exports = io;