var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
var path = require('path');

server.listen(8092);

app.use(express.static(path.join(__dirname, 'public')));

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(":memory:");

db.serialize(function() {
    db.run("create table square (id integer primary key autoincrement, x integer, y integer, color text, owner text)");
});

io.sockets.on('connection', function (socket) {
  socket.emit('userId', socket.id);

  socket.on('getSquares', function (data) {
    db.all("SELECT id, x, y, color, owner FROM square", function(err, rows) {
      socket.emit('squares', {
        squares: rows
      });
    });
  });

  socket.on('createSquare', function (data) {
    var query = 'INSERT INTO square (x, y, color, owner) VALUES (?, ?, ?, ?)';
    db.run(query, [data.x, data.y, data.color, socket.id], function() {
      var newSquare = {
        id: this.lastID,
        x: data.x,
        y: data.y,
        color: data.color,
        owner: socket.id
      };
      socket.emit('newSquare', newSquare);
      socket.broadcast.emit('newSquare', newSquare);
    })
  });

  socket.on('changeColor', function (data) {
    db.run("UPDATE square SET color = ? WHERE id = ?", data.color, data.id);
    var newSquareColor = {
      id: data.id,
      color: data.color
    };
    socket.emit('colorChanged', newSquareColor);
    socket.broadcast.emit('colorChanged', newSquareColor);
  });

  socket.on('moveSquare', function (data) {
    db.run("UPDATE square SET x = ?, y = ? WHERE id = ?", data.x, data.y, data.id);
    var newSquareCoords = {
      id: data.id,
      x: data.x,
      y: data.y
    };
    socket.broadcast.emit('squareMoved', newSquareCoords);
  });
});
