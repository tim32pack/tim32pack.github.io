// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

// Routing
app.use(express.static(path.join(__dirname, 'public')));

let users = [];

io.on("connection", function(socket){
  socket.on("newuser",function(username){
    socket.broadcast.emit("update", username + " se připojil.");  
    users[socket.id] = username;
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('update', users[socket.id] + " se odpojil.");
    delete users[socket.id];
  });  
  socket.on("exituser",function(username){
    socket.broadcast.emit("update", username + " se odpojil.");
  }); 
  socket.on("chat",function(message){
    socket.broadcast.emit("chat", message);
  });
});

// Server status
server.listen(3000, () => {
  console.log('SERVER IS RUNNING');
});