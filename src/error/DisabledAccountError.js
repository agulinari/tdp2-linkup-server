var sys = require('util'),

DisabledAccountError = function() {
	this.status = 401;
	this.message = "La cuenta se encuentra desactivada";
};

sys.inherits(DisabledAccountError, Error);

module.exports = DisabledAccountError;
