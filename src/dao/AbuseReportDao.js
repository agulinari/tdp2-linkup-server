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

