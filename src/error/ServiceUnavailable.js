var sys = require('util'),

ServiceUnavailable = function (message) {
    this.status = 503;
    this.message = message;
};

sys.inherits(ServiceUnavailable, Error);

module.exports = ServiceUnavailable;
