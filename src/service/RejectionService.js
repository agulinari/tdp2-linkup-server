var async = require('async');
var userDao = require('../dao/UserProfileDao');
var rejectionDao = require('../dao/RejectionDao');
var utils = require('../utils/Utils');
var RejectionError = require("../error/RejectionError");
var NotFound = require("../error/NotFound");

/**
 * Get Rejection
 * @param {String} fbidUser
 * @param {String} fbidCandidate
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getRejection = function (fbidUser, fbidCandidate, callback) {
    rejectionDao.findRejection(fbidUser, fbidCandidate, function (err, rejection) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'rejection': rejection,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Save Rejection
 * @param {Request} Request
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.saveRejection = function (fbidUser, fbidCandidate, callback) {
    var user = {};
    var candidate = {};
    async.waterfall([
        function getUser(next) {
            userDao.getUserProfileById(fbidUser, next);
        },
        function getCandidate(response, next) {
            user = response;
            if (user == null) {
		        next(new NotFound("No se encontro el usuario"), null);
                return;
            }
            userDao.getUserProfileById(fbidCandidate, next);
        },
        function findRejections(response, next) {
            candidate = response;
            if (candidate == null) {
		        next(new NotFound("No se encontro el candidato"), null);
                return;
            }
            rejectionDao.saveRejection(fbidUser, fbidCandidate, next);
        }
    ],
    function (err, rejection) {
        if (err) {
            callback(err);
            return;
        }
        console.log(JSON.stringify(rejection));
        var response = {
            'rejection': rejection,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Delete Rejection
 * @param {String} fbidUser
 * @param {String} fbidCandidate
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteRejection = function (fbidUser, fbidCandidate, callback) {
    rejectionDao.deleteRejection(fbidUser, fbidCandidate, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Delete all Rejections
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteAllRejections = function (fbidUser, callback) {
    rejectionDao.deleteAllRejections(fbidUser, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

