var service = require('../service/CleanService');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');
var async = require('async');

exports.getClean = function (req, res) {
    service.clean(function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            metadata : utils.getMetadata(1)
        }
        console.log('HIT HIT');
        return res.json(response);
    });
};

exports.getCleanUser = function (req, res) {
    var idUser = req.params.idUser;
    service.cleanUser(idUser, function (err, data) {
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

