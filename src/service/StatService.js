var async = require('async');
var activityLogDao = require('../dao/ActivityLogDao');
var abuseReportDao = require('../dao/AbuseReportDao');
var userDao = require('../dao/UserDao');
var NotFound = require("../error/NotFound");

/**
 * Get User activity stats
 * @param {Function} callback
 */
exports.getUserActivityStats = function (fromDate, toDate, callback) {
    async.waterfall([
        // Find ActivityLogs by date interval
        function (next) {
            var criteria = { 'fromDate': fromDate, 'toDate': toDate };
            activityLogDao.countActivityLogsByDateAndAccountType(criteria,
                                                     (err, activityLogs) => {
                next(err, activityLogs);
            });
        }
    ],
    function (err, stats) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, stats);
    });
};

/**
 * Get User status stats
 * @param {Function} callback
 */
exports.getUserStatus = function (callback) {
    async.waterfall([
        // Find ActivityLogs by date interval
        function (next) {
            userDao.countActivityLogsByDateAndAccountType(criteria,
                                                     (err, activityLogs) => {
                next(err, activityLogs);
            });
        }
    ],
    function (err, stats) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, stats);
    });
};

/**
 * Get User activity stats
 * @param {Function} callback
 */
exports.getAbuseReportStats = function (fromDate, toDate, callback) {
    async.waterfall([
        // Find ActivityLogs by date interval
        function (next) {
            var criteria = { 'fromDate': fromDate, 'toDate': toDate };
            abuseReportDao.countAbuseReportsByDateAndCategory(criteria,
                                                     (err, activityLogs) => {
                next(err, activityLogs);
            });
        }
    ],
    function (err, stats) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, stats);
    });
};

