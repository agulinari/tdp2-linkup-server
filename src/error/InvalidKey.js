var sys = require('util'),

InvalidKey = function (message) {
    this.status = 500;
    this.message = message;
};

sys.inherits(InvalidKey, Error);

module.exports = InvalidKey;
