AppInstance = (function() {
    function AppInstance() {
        this.socket = io.connect(App.config.socketio);
        this.objects = {};

        // Sync data
        this.createSocketHandlers();
        this.loadShapes();
    }

    // Socket.io handlers
    AppInstance.prototype.createSocketHandlers = function() {
        this.socket.on('squares', function(data) {
            for(var i = 0; i < data.squares.length; i++) {
                var squareData = data.squares[i];
                new App.Objects.Square(squareData)
            }
        });
        this.socket.on('newSquare', function(data) {
            new App.Objects.Square(data)
        });
        this.socket.on('squareMoved', function(data) {
            var rect = App.instance.objects['rect' + data.id];
            $(rect.el).attr('x', data.x).attr('y', data.y).attr('transform', '');
        });
        this.socket.on('colorChanged', function(data) {
            var rect = App.instance.objects['rect' + data.id];
            $(rect.el).attr('fill', data.color);
        });
        this.socket.on('userId', function(data) {
            App.instance.userId = data;
        })
    };

    // Send events to socketio
    AppInstance.prototype.loadShapes = function() {
        this.socket.emit('getSquares');
    };
    AppInstance.prototype.createSquare = function(x, y, color) {
        this.socket.emit('createSquare', {
            x: x,
            y: y,
            color: color
        });
    };
    AppInstance.prototype.moveSquare = function(squareId, x, y) {
        this.socket.emit('moveSquare', {
            id: squareId,
            x: x,
            y: y
        });
    };
    AppInstance.prototype.changeColor = function(squareId, color) {
        this.socket.emit('changeColor', {
            id: squareId,
            color: color
        });
    };

    return AppInstance;
})();

App.instance = new AppInstance();
var draggableDeck = new App.Actions.Draggable($('#shapes_deck')[0]);

$('#newSquare').click(function() {
    var randomX = App.randomInt(0, 900);
    var randomY = App.randomInt(0, 600);
    var randomColorId = App.randomInt(0, App.Objects.Square.colors.length);
    var randomColor = App.Objects.Square.colors[randomColorId];
    App.instance.createSquare(randomX, randomY, randomColor);
})
