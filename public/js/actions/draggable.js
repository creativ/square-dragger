App.Actions.Draggable = (function() {
    function Draggable(el) {
        this.el = el;

        // Add event handlers
        this.el.addEventListener('mousedown', (function(_this) {
            return function(event) {
                return _this.grab(event);
            };
        })(this));
        this.el.addEventListener('mousemove', (function(_this) {
            return function(event) {
                return _this.drag(event);
            };
        })(this));
        this.el.addEventListener('mouseup', (function(_this) {
            return function(event) {
                return _this.drop(event);
            };
        })(this));

        this.trueCoords = this.el.createSVGPoint();
        this.grabPoint = this.el.createSVGPoint();
        this.backDrop = this.el.getElementById('BackDrop');
        this.isClick = false;

        return this;
    }

    Draggable.prototype.grab = function(event) {
        var targetElement = event.target;
        this.isClick = true;
        if(this.backDrop != targetElement && $(targetElement).data('owner') == App.instance.userId) {
            this.dragTarget = targetElement;

            this.dragTarget.parentNode.appendChild(this.dragTarget);
            this.dragTarget.setAttributeNS(null, 'pointer-events', 'none');

            var transMatrix = this.dragTarget.getCTM();
            this.grabPoint.x = this.trueCoords.x - Number(transMatrix.e);
            this.grabPoint.y = this.trueCoords.y - Number(transMatrix.f);
        }
    }

    Draggable.prototype.drag = function(event) {
        this.getTrueCoords(event);
        if (this.dragTarget) {
            var newX = this.trueCoords.x - this.grabPoint.x;
            var newY = this.trueCoords.y - this.grabPoint.y;
            this.dragTarget.setAttributeNS(null, 'transform', 'translate(' + newX + ',' + newY + ')');
            this.isClick = false;
        }
    }

    Draggable.prototype.drop = function(event) {
        this.getTrueCoords(event);
        if(this.dragTarget) {
            var newX = this.trueCoords.x - this.grabPoint.x;
            var newY = this.trueCoords.y - this.grabPoint.y;

            var targetElement = event.target;
            this.dragTarget.setAttributeNS(null, 'pointer-events', 'all');

            var bbox = this.dragTarget.getBBox();
            var id = $(this.dragTarget).data('id');
            var rect = App.instance.objects['rect' + id];
            rect.move(bbox.x + newX, bbox.y + newY)

            this.dragTarget = null;
            if(this.isClick) {
                rect.changeColor();
            }
        }
    }

    Draggable.prototype.getTrueCoords = function(event) {
        var newScale = this.el.currentScale;
        var translation = this.el.currentTranslate;
        this.trueCoords.x = (event.clientX - translation.x) / newScale;
        this.trueCoords.y = (event.clientY - translation.y) / newScale;
    }

    return Draggable;
})();
