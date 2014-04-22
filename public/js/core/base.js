window.App = App = {
    Actions: {},
    Objects: {},
    config: {
        socketio: 'http://localhost'
    },
    instance: null
}

var randomInt, extend, merge;

App.randomInt = randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

App.extend = extend = function(object, properties) {
    var key, val;
    for (key in properties) {
        val = properties[key];
        object[key] = val;
    }
    return object;
};

App.merge = merge = function(options, overrides) {
    return extend(extend({}, options), overrides);
};
