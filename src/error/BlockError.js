var sys = require('util'),

BlockError = function(message) {
    this.status = 500;
    this.message = message;
};

sys.inherits(BlockError, Error);

module.exports = BlockError;
