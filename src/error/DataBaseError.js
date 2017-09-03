var sys = require('util'),

DataBaseError = function (message) {
    this.status = 500;
    this.message = message;
};

sys.inherits(DataBaseError, Error);

module.exports = DataBaseError;
