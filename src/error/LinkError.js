var sys = require('util'),

LinkError = function(message) {
    this.status = 500;
    this.message = message;
};

sys.inherits(LinkError, Error);

module.exports = LinkError;
