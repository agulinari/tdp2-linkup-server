var async = require('async');
var activityLogDao = require('../dao/ActivityLogDao');
var NotFound = require("../error/NotFound");

/**
 * Get all ActivityLogs
 * @param {Function} callback
 */
exports.getActivityLogs = function (callback) {
    activityLogDao.findAllActivityLogs((err, activityLogs) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, activityLogs);
    });
};

/**
 * Save ActivityLog
 * @param {Object} activityLogData
 * @param {Function} callback
 */
exports.saveActivityLog = function (activityLogData, callback) {
    async.waterfall([
        function save(next) {
            activityLog = {
                idUser: activityLogData.idUser,
                isPremium: activityLogData.isPremium,
                activityType: activityLogData.activityType
            };
            activityLogDao.saveActivityLog(activityLog, (err, activityLog) => {
                if (err) {
                    next(err);
                    return;
                }
                next(null, activityLog);
            });
        }
    ],
    function (err, activityLog) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, activityLog);
    });
};

/**
 * Delete all ActivityLogs
 * @param {Function} callback
 */
exports.deleteActivityLogs = function (callback) {
    activityLogDao.deleteAllActivityLogs((err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

