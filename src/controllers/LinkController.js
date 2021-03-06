var service = require('../service/LinkService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');

//GET - Returns a Link from db
exports.getUserCandidateLink = function(req, res) {
    var idUser = req.params.idUser;
    var idCandidate = req.params.idCandidate;
    service.getUserCandidateLink(idUser, idCandidate, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//GET - Returns user's Link from db
exports.getUserLinks = function(req, res) {
    var idUser = req.params.idUser;
    service.getUserLinks(idUser, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

exports.getLinksUsersByCandidate = function(req,res){
    var idsUser = req.body.idsUser;
    var idCandidate = req.body.idCandidate;

    service.getLinksUsersByCandidate(idsUser,idCandidate,function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
}

//GET - Returns all Link from db
exports.getLinks = function(req, res) {
    service.getLinks(function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//POST - Insert a new Link in db
exports.postLink = function(req, res) {
    var linkReq = req.body.acceptance;
   /*
    var isValid = jsonValidator.isLinkValid(linkReq);
    if (!isValid) {
        callback(new BadRequest("Invalid Link's json format"));
        return;
    }*/

   /*    service.saveLink(l.fbidUser, l.fbidCandidate, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });*/

    service.linkCandidate(linkReq.fbidUser,linkReq.fbidCandidate,linkReq.typeOfLink, function (err, response) {
        if (err) {
            console.log(err);
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//DELETE - Deletes a Link from db
exports.deleteLink = function(req, res) {
    var idUser = req.params.idUser;
    var idCandidate = req.params.idCandidate;
    service.deleteLink(idUser, idCandidate, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//DELETE - Deletes all User's Links from db
exports.deleteUserLinks = function(req, res) {
    var idUser = req.params.idUser;
    service.deleteUserLinks(idUser, function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//DELETE - Deletes all Links from db
exports.deleteLinks = function(req, res) {
    service.deleteLinks(function(err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

