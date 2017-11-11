var sys = require('util'),

RecommendationError = function(message) {
    this.status = 500;
    this.message = message;
};

sys.inherits(RecommendationError, Error);

module.exports = RecommendationError;
