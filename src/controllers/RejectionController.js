var service = require('../service/RejectionService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');

//GET - Returns a Rejection from db
exports.getUserCandidateRejection = function(req, res) {
    var idUser = req.params.idUser;
    var idCandidate = req.params.idCandidate;
    service.getUserCandidateRejection(idUser, idCandidate, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//GET - Returns a Rejection from db
exports.getUserRejections = function(req, res) {
    var idUser = req.params.idUser;
    service.getUserRejections(idUser, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//GET - Returns a Rejection from db
exports.getRejections = function(req, res) {
    service.getRejections(function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//POST - Insert a new Rejection in db
exports.postRejection = function(req, res) {
    var r = req.body.rejection;
    /*
    var isValid = jsonValidator.isRejectionValid(rejection);
    if (!isValid) {
        callback(new BadRequest("Invalid Rejection's json format"));
        return;
    }
    */
    service.saveRejection(r.fbidUser, r.fbidCandidate, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//DELETE - Deletes a Rejection from db
exports.deleteRejection = function(req, res) {
    var idUser = req.params.idUser;
    var idCandidate = req.params.idCandidate;
    service.deleteRejection(idUser, idCandidate, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//DELETE - Deletes all User Rejections from db
exports.deleteUserRejections = function(req, res) {
    var idUser = req.params.idUser;
    service.deleteUserRejections(idUser, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//DELETE - Deletes all Rejections from db
exports.deleteRejections = function(req, res) {
    service.deleteRejections(function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

