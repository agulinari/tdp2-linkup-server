var service = require('../service/MatchService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');

//GET - Returns a Matches from db
exports.getUserMatches = function(req, res) {
    var idUser = req.params.idUser;
    
    service.getUserMatches(idUser, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};


//Delete
exports.deleteMatches = function(req, res) {
       
    service.deleteMatches(function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};
