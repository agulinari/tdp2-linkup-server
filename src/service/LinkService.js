var async = require('async');
var userDao = require('../dao/UserProfileDao');
var linkDao = require('../dao/LinkDao');
var utils = require('../utils/Utils');
var LinkError = require("../error/LinkError");
var NotFound = require("../error/NotFound");

/**
 * Get Link
 * @param {String} fbidUser
 * @param {String} fbidCandidate
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserCandidateLink = function (fbidUser, fbidCandidate, callback) {
    linkDao.findLink(fbidUser, fbidCandidate, function (err, link) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'link': link,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Get User Links
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserLinks = function (fbidUser, callback) {
    linkDao.findUserLinks(fbidUser, function (err, links) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'links': links,
            metadata : utils.getMetadata(links.length)
        }
        callback(null, response);
    });
};

/**
 * Get Links
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getLinks = function (callback) {
    linkDao.findLink(function (err, links) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'links': links,
            metadata : utils.getMetadata(links.length)
        }
        callback(null, response);
    });
};

/**
 * Save Link
 * @param {Request} Request
 * @param {Function} callback  The function to call when store is complete.
 */
exports.saveLink = function (fbidUser, fbidCandidate, callback) {
    var user = {};
    var candidate = {};
    var link = {};
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
        function storeLink(response, next) {
            candidate = response;
            if (candidate == null) {
		        next(new NotFound("No se encontro el candidato"), null);
                return;
            }
            linkDao.saveLink(fbidUser, fbidCandidate, next);
        },
        function testMatch(response, next) {
            link = response;
            console.log('TODO: test match conditions');
            next(null, link);
        }
    ],
    function (err, link) {
        if (err) {
            callback(err);
            return;
        }
        console.log(JSON.stringify(link));
        var response = {
            'link': link,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Delete Link
 * @param {String} fbidUser
 * @param {String} fbidCandidate
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteLink = function (fbidUser, fbidCandidate, callback) {
    linkDao.deleteLink(fbidUser, fbidCandidate, function (err, data) {
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
 * Delete all user's Links
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteUserLinks = function (fbidUser, callback) {
    linkDao.deleteUserLinks(fbidUser, function (err, data) {
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
 * Delete all Links
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteLinks = function (callback) {
    linkDao.deleteLinks(function (err, data) {
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

