'use strict';

var ActivityLog = require('../model/ActivityLog');

/**
 * Retrieves all ActivityLogs
 * @param {Function} callback
 **/
exports.findAllActivityLogs = function(callback) {
    var proj = "-__v";
    ActivityLog.find(null, proj, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves an ActivityLog by ID
 * @param {Function} callback
 **/
exports.findActivityLogById = function(idActivityLog, callback) {
    var proj = "-__v";
    ActivityLog.findOne({ _id: idActivityLog }, proj, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves ActivityLogs by criteria
 * @param {Object} criteria
 * @param {Function} callback
 **/
exports.countActivityLogsByDateAndAccountType = function(criteria, callback) {
    var query = {};
    var time = {};
    var dateParts;
    if (criteria.fromDate != undefined) {
        dateParts = criteria.fromDate.split("/");
        time.$gte = new Date(Date.UTC(dateParts[2],
                                      dateParts[1] - 1,
                                      dateParts[0],
                                      0, 0, 0));
        query.time = time;
    }
    if (criteria.toDate != undefined) {
        dateParts = criteria.toDate.split("/");
        time.$lte = new Date(Date.UTC(dateParts[2],
                                      dateParts[1] - 1,
                                      dateParts[0],
                                      23, 59, 59));
        query.time = time;
    }
    
    ActivityLog.aggregate([
        { $match: query },
        
        {
            $group: {
                "_id": {
                    idUser:"$idUser",
                    isPremium:"$isPremium",
                    year: { $year: "$time" },
                    month:{ $month: "$time"},
                    day: { $dayOfMonth: "$time"}
                }
            }
        },
        {
            $group: {
                "_id": {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: "$_id.day"
                },
                "basic": {
                    $sum: { '$cond': [{'$eq':['$_id.isPremium',false]},1,0] }
                },
                "premium": {
                    $sum: {'$cond': [{'$eq':['$_id.isPremium',true]},1,0]}
                }
            }
        },
        
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1} },
        
        {
            $project: {
                date: {
                    $concat:[
                        {"$substr": [ "$_id.year", 0, 4 ]},
                        "/",
                        {"$substr": [ "$_id.month", 0, 2 ]},
                        "/",
                        {"$substr": [ "$_id.day", 0, 2 ]}
                    ]
                },
                premium: "$premium",
                basic: "$basic",
                _id: false
            }
        }
    ], function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

exports.saveActivityLog = function(activityLogData, callback) {
    var newActivityLog = new ActivityLog(activityLogData);
    newActivityLog.save((err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all Images
 * @param {Function} callback
 **/
exports.deleteAllActivityLogs = function(callback) {
    ActivityLog.deleteMany(null, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

