var sys = require('util'),

RejectionError = function(message) {
    this.status = 500;
    this.message = message;
};

sys.inherits(RejectionError, Error);

module.exports = RejectionError;
