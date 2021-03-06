'use strict';

var AbuseReport = require('../model/AbuseReport');
//var AbuseReportError = require("../error/AbuseReportError");

/**
 * Retrieves all AbuseReports
 * @param {Function} callback
 **/
exports.findAllAbuseReports = function(callback) {
    var proj = "-__v";
    AbuseReport.find(null, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves an AbuseReport by ID
 * @param {Function} callback
 **/
exports.findAbuseReportById = function(idAbuseReport, callback) {
    var proj = "-__v";
    AbuseReport.findOne({ _id: idAbuseReport }, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves AbuseReports by criteria
 * @param {Object} criteria
 * @param {Function} callback
 **/
exports.findAbuseReportsByCriteria = function(criteria, callback) {
    var query = {};
    if (criteria.isOpen != undefined) {
        query.isOpen = criteria.isOpen;
    }
    
    var proj = "-__v";
    AbuseReport.find(query, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves all AbuseReports sorted by Reported user
 * @param {Function} callback
 **/
exports.findAllAbuseReportsSortedByReportedUser = function(callback) {
    
    AbuseReport.aggregate([
        {$sort: {idReported:1}},
        {
            $group:{
                _id:{idReported:"$idReported", fullnameReported:"$fullnameReported"},
                reports:{ $push:{
                            _id:"$_id",
                            idReporter:"$idReporter",
                            fullnameReporter:"$fullnameReporter",
                            time:"$time",
                            idCategory:"$idCategory",
                            comment:"$comment",
                            isOpen:"$isOpen"
                        }
                },
                size:{$sum:1}
            }
        },
        {$sort: {size:-1}}, {$unwind:"$reports"},
        {
            $project: {
                _id:"$reports._id",
                idReported:"$_id.idReported",
                fullnameReported:"$_id.fullnameReported",
                idReporter:"$reports.idReporter",
                fullnameReporter:"$reports.fullnameReporter",
                time:"$reports.time",
                idCategory:"$reports.idCategory",
                comment:"$reports.comment",
                isOpen:"$reports.isOpen"
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

/**
 * Retrieves all open AbuseReports sorted by Reported user
 * @param {Function} callback
 **/
exports.findAllOpenAbuseReportsSortedByReportedUser = function(callback) {
    
    AbuseReport.aggregate([
        {$match: { isOpen: true} },
        {$sort: {idReported:1}},
        {
            $group:{
                _id:{idReported:"$idReported", fullnameReported:"$fullnameReported"},
                reports:{ $push:{
                            _id:"$_id",
                            idReporter:"$idReporter",
                            fullnameReporter:"$fullnameReporter",
                            time:"$time",
                            idCategory:"$idCategory",
                            comment:"$comment",
                            isOpen:"$isOpen"
                        }
                },
                size:{$sum:1}
            }
        },
        {$sort: {size:-1}}, {$unwind:"$reports"},
        {
            $project: {
                _id:"$reports._id",
                idReported:"$_id.idReported",
                fullnameReported:"$_id.fullnameReported",
                idReporter:"$reports.idReporter",
                fullnameReporter:"$reports.fullnameReporter",
                time:"$reports.time",
                idCategory:"$reports.idCategory",
                comment:"$reports.comment",
                isOpen:"$reports.isOpen"
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

/**
 * Retrieves all closed AbuseReports sorted by Reported user
 * @param {Function} callback
 **/
exports.findAllClosedAbuseReportsSortedByReportedUser = function(callback) {
    
    AbuseReport.aggregate([
        {$match: { isOpen: false} },
        {$sort: {idReported:1}},
        {
            $group:{
                _id:{idReported:"$idReported", fullnameReported:"$fullnameReported"},
                reports:{ $push:{
                            _id:"$_id",
                            idReporter:"$idReporter",
                            fullnameReporter:"$fullnameReporter",
                            time:"$time",
                            idCategory:"$idCategory",
                            comment:"$comment",
                            isOpen:"$isOpen"
                        }
                },
                size:{$sum:1}
            }
        },
        {$sort: {size:-1}}, {$unwind:"$reports"},
        {
            $project: {
                _id:"$reports._id",
                idReported:"$_id.idReported",
                fullnameReported:"$_id.fullnameReported",
                idReporter:"$reports.idReporter",
                fullnameReporter:"$reports.fullnameReporter",
                time:"$reports.time",
                idCategory:"$reports.idCategory",
                comment:"$reports.comment",
                isOpen:"$reports.isOpen"
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

exports.saveAbuseReport = function(abuseReportData, callback) {
    var newAbuseReport = new AbuseReport(abuseReportData);
    newAbuseReport.save(function(err, value) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, value);
    });
};

exports.updateAbuseReport = function(abuseReportData, callback) {
    var newAbuseReportData = Object.assign({}, abuseReportData);
    AbuseReport.findOneAndUpdate({_id:abuseReportData._id},
                                 newAbuseReportData,
                                 {
                                    projection: '-__v',
                                    new: true //returnNewDocument
                                 },
                                 (err, value) => {
        if (err) {
            callback(err, null);
            return;
		}
        callback(null, value);
	});
};

exports.closeAbuseReportsForUser = function(idUser, callback) {
    AbuseReport.update({idReported:idUser},
                           { $set: { isOpen: false} },
                           { multi: true },
                           (err, value) => {
        if (err) {
            callback(err, null);
            return;
		}
        callback(null, value);
	});
};

/**
 * Deletes all Images
 * @param {Function} callback
 **/
exports.deleteAllAbuseReports = function(callback) {
    AbuseReport.deleteMany(null, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves AbusReport stats by date and category
 * @param {Object} criteria
 * @param {Function} callback
 **/
exports.countAbuseReportsByDateAndCategory = function(criteria, callback) {
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
   
    AbuseReport.aggregate([
        { $match: query },
        
        {
            $group: {
                "_id": {
                    idCategory:"$idCategory"
                },
                "count": {
                    $sum: 1
                }
            }
        },  
        {
            $group: {
                "_id": {
                   idCategory:"$idCategory"
                },
                "abusiveLang": {
                    $sum: { '$cond': [{'$eq':['$_id.idCategory', 1]}, '$count', 0] }
                },
                "illegalImage": {
                    $sum: {'$cond': [{'$eq':['$_id.idCategory', 2]}, '$count', 0]}
                },
                "spam": {
                    $sum: {'$cond': [{'$eq':['$_id.idCategory', 3]}, '$count', 0]}
                },
                "other": {
                    $sum: {'$cond': [{'$eq':['$_id.idCategory', 4]}, '$count', 0]}
                },
                "total": {
                    $sum: '$count'
                }
            }
        },      
        {
            $project: {
                abusiveLang: "$abusiveLang",
                illegalImage: "$illegalImage",
                spam: "$spam",
                other: "$other",
                total: "$total",
                _id: false
            }
        }
        
    ], function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        if (value.length === 0) {
            value.push({
                abusiveLang: 0,
                illegalImage: 0,
                spam: 0,
                other: 0,
                total: 0
            });
        }
        
        callback(null, value[0]);
    });
};

