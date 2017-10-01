var service = require('../service/CleanService');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');
var async = require('async');

exports.getClean = function (req, res) {
    service.clean(function(err, users) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.getCleanUser = function (req, res) {
    var idUser = req.params.idUser;
    service.cleanUser(idUser, function (err, user) {
        if (err) {
            console.log(err);
            return errorHandler.throwError(res, err);
        }
        var response = {
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

