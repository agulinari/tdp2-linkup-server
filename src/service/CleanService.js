var userDao = require('../dao/UserDao');
var imageDao = require('../dao/ImageDao');
var rejectionDao = require('../dao/RejectionDao');
var blockDao = require('../dao/BlockDao');
var abuseReportDao = require('../dao/AbuseReportDao');
var utils = require('../utils/Utils');
var async = require('async');
var BadRequest = require("../error/BadRequest");
var NotFound = require("../error/NotFound");
var jsonValidator = require('../utils/JsonValidator');



/**
 * Clean User
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.cleanUser = function (fbidUser, callback) {
    async.waterfall([
        function deleteUser(next) {
            userDao.deleteUser(fbidUser, next);
        },
        function deleteImages(data, next) {
            imageDao.deleteImages(fbidUser, next);
        },
        function deleteRejections(user, next) {
            rejectionDao.deleteUserRejections(fbidUser, next);
        }
    ],
    function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, data);
    });
};

/**
 * Clean all Users
 * @param {Function} callback
 */
exports.cleanUsers = function (callback) {
    async.waterfall([
        function deleteUsers(next) {
            userDao.deleteAllUsers(next);
        },
        function deleteImages(data, next) {
            imageDao.deleteAllImages(next);
        },
        function deleteRejections(data, next) {
            rejectionDao.deleteRejections(next);
        },
        function deleteBlocks(data, next) {
            blockDao.deleteBlocks(next);
        },
        function deleteAbuseReports(data, next) {
            abuseReportDao.deleteAllAbuseReports(next);
        },
    ],
    function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, data);
    });
};

/**
 * Clean all AbuseReports
 * @param {Function} callback
 */
exports.cleanAbuseReports = function (callback) {
    async.waterfall([
        function deleteAbuseReports(next) {
            abuseReportDao.deleteAllAbuseReports(next);
        }
    ],
    function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, data);
    });
};


