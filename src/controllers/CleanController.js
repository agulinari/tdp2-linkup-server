var service = require('../service/CleanService');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');
var async = require('async');

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

exports.getCleanUsers = function (req, res) {
    service.cleanUsers(function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.getCleanAbuseReports = function (req, res) {
    service.cleanAbuseReports(function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.getCleanAds = function (req, res) {
    service.cleanAds((err, data) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.getCleanBlocks = function (req, res) {
    service.cleanBlocks(function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.getCleanRecommendations = function (req, res) {
    service.cleanRecommendations(function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

