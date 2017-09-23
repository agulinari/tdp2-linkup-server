var sys = require('util'),

ImageError = function(message) {
    this.status = 500;
    this.message = message;
};

sys.inherits(ImageError, Error);

module.exports = ImageError;
