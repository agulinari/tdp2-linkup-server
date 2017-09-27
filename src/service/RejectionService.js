var async = require('async');
var userDao = require('../dao/UserDao');
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
exports.getUserCandidateRejection = function (fbidUser, fbidCandidate, callback) {
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
 * Get User Rejections
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserRejections = function (fbidUser, callback) {
    rejectionDao.findUserRejections(fbidUser, function (err, rejections) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'rejections': rejections,
            metadata : utils.getMetadata(rejections.length)
        }
        callback(null, response);
    });
};

/**
 * Get Rejections to the user by users
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserRejections = function (fbidUser, callback) {
    rejectionDao.findWhoRejectedUser(fbidUser, function (err, rejections) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'rejections': rejections,
            metadata : utils.getMetadata(rejections.length)
        }
        callback(null, response);
    });
};

/**
 * Get Rejections
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getRejections = function (callback) {
    rejectionDao.findRejections(function (err, rejections) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'rejections': rejections,
            metadata : utils.getMetadata(rejections.length)
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
    var rejection = {};
    async.waterfall([
        function getUser(next) {
            userDao.findUser(fbidUser, next);
        },
        function getCandidate(response, next) {
            user = response;
            if (user == null) {
		        next(new NotFound("No se encontro el usuario"), null);
                return;
            }
            userDao.findUser(fbidCandidate, next);
        },
        function findRejections(response, next) {
            candidate = response;
            if (candidate == null) {
		        next(new NotFound("No se encontro el candidato"), null);
                return;
            }
            rejectionDao.saveRejection(fbidUser, fbidCandidate, next);
        },
        function deleteLinkFromCandidate(response, next) {
            rejection = response;
            console.log('TODO: delete link if exists from candidate');
            next(null, rejection);
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
 * Delete all user's Rejections
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteUserRejections = function (fbidUser, callback) {
    rejectionDao.deleteUserRejections(fbidUser, function (err, data) {
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
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteRejections = function (callback) {
    rejectionDao.deleteRejections(function (err, data) {
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

