var async = require('async');
var abuseReportDao = require('../dao/AbuseReportDao');
var userDao = require('../dao/UserDao');
var NotFound = require("../error/NotFound");


/**
 * Get all AbuseReports
 * @param {Function} callback
 */
exports.getAbuseReports = function (callback) {
    abuseReportDao.findAllAbuseReports(function (err, abuseReports) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, abuseReports);
    });
};

/**
 * Get open AbuseReports
 * @param {Function} callback
 */
exports.getOpenAbuseReports = function (callback) {
    var criteria = {isOpen: true};
    abuseReportDao.findAbuseReportsByCriteria(criteria, (err, abuseReports) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, abuseReports);
    });
};

/**
 * Get closed AbuseReports
 * @param {Function} callback
 */
exports.getClosedAbuseReports = function (callback) {
    var criteria = {isOpen: false};
    abuseReportDao.findAbuseReportsByCriteria(criteria, (err, abuseReports) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, abuseReports);
    });
};

/**
 * Save AbuseReport
 * @param {Object} abuseReportData
 * @param {Function} callback
 */
exports.saveAbuseReport = function (abuseReportData, callback) {
    async.waterfall([
        function getReporter(next) {
            userDao.findUser(abuseReportData.idReporter, (err, user) => {
                if (err) {
                    next(err);
                    return;
                }
                if (user == null) {
                    var msg = "No se encontro el usuario reportador";
		            next(new NotFound(msg), null);
                    return;
                }
                next();
            });
        },
        function getReported(next) {
            userDao.findUser(abuseReportData.idReported, (err, user) => {
                if (err) {
                    next(err);
                    return;
                }
                if (user == null) {
                    var msg = "No se encontro el usuario reportado";
		            next(new NotFound(msg), null);
                    return;
                }
                next();
            });
        },
        function save(next) {
            abuseReport = {
                idReporter: abuseReportData.idReporter,
                firstNameReporter: abuseReportData.firstNameReporter,
                lastNameReporter: abuseReportData.lastNameReporter,
                idReported: abuseReportData.idReported,
                firstNameReported: abuseReportData.firstNameReported,
                lastNameReported: abuseReportData.lastNameReported,
                idCategory: abuseReportData.idCategory,
                   comment: abuseReportData.comment != undefined
                                ? abuseReportData.comment
                                : null,
                    isOpen: abuseReportData.isOpen != undefined
                                ? abuseReportData.isOpen
                                : true
            };
            abuseReportDao.saveAbuseReport(abuseReport, (err, abuseReport) => {
                if (err) {
                    next(err);
                    return;
                }
                next(null, abuseReport);
            });
        },
        function block(abuseReport, next) {
            console.log('TODO: block user on new abuse report');
            next(null, abuseReport);
        },
    ],
    function (err, abuseReport) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, abuseReport);
    });
};

/**
 * Update AbuseReport
 * @param {Object} abuseReportData
 * @param {Function} callback
 */
exports.updateAbuseReport = function (abuseReportData, callback) {
    async.waterfall([
        function getAbuseReport(next) {
            abuseReportDao.findAbuseReportById(abuseReportData.idReporter,
                                               (err, abuseReport) => {
                if (err) {
                    next(err);
                    return;
                }
                if (abuseReport == null) {
                    var msg = "No se encontro el reporte de abuso";
		            next(new NotFound(msg), null);
                    return;
                }
                next(null, abuseReport);
            });
        },
        function update(abuseReport, next) {
            abuseReport = {
                       _id: abuseReport._id,
                idReporter: abuseReport.idReporter,
                firstNameReporter: abuseReportData.firstNameReporter,
                lastNameReporter: abuseReportData.lastNameReporter,
                idReported: abuseReport.idReported,
                firstNameReported: abuseReportData.firstNameReported,
                lastNameReported: abuseReportData.lastNameReported,
                idCategory: abuseReport.idCategory,
                   comment: abuseReport.comment,
                    isOpen: abuseReportData.isOpen != undefined
                                ? abuseReportData.isOpen
                                : abuseReport.isOpen
            };
            abuseReportDao.updateAbuseReport(abuseReport,
                                            (err, abuseReport) => {
                if (err) {
                    console.log(err);
                    next(err);
                    return;
                }
                next(null, abuseReport);
            });
        }
    ],
    function (err, abuseReport) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, abuseReport);
    });
};

/**
 * Delete all AbuseReports
 * @param {Function} callback
 */
exports.deleteAbuseReports = function (callback) {
    abuseReportDao.deleteAllAbuseReports(function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

