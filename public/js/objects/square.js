App.Objects.Square = (function() {
    function Square(squareData) {
        var defatultSquare = {
            id: null,
            x: 0,
            y: 0,
            fill: "grey",
            owner: null
        };
        squareData = App.merge(defatultSquare, squareData);

        // Create SVG square
        this.el = Square.createElement('rect', {
            x: squareData.x,
            y: squareData.y,
            fill: squareData.color,
            'fill-opacity': squareData.owner == App.instance.userId ? 1.0 : 0.1,
            width: 100,
            height: 100
        });

        // Set square id and owner
        this.id = squareData.id;
        var $rect = $(this.el);
        $rect.data('id', squareData.id);
        $rect.data('owner', squareData.owner);

        // Append to SVG element
        $('#shapes_deck').append(this.el);

        // Create new object
        App.instance.objects['rect' + squareData.id] = this;
        return this;
    }

    Square.prototype.move = function(x, y) {
        App.instance.moveSquare(this.id, x, y);
    }

    Square.prototype.changeColor = function() {
        var randomColorId = App.randomInt(0, App.Objects.Square.colors.length);
        var randomColor = App.Objects.Square.colors[randomColorId];
        App.instance.changeColor(this.id, randomColor);
    }

    Square.createElement = function(tag, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
        return el;
    }

    Square.colors = ['red', 'blue', 'yellow', 'pink', 'orange', 'grey'];
    return Square;
})();
