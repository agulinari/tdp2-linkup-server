var service = require('../service/AbuseReportService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');

//GET - Returns the AbuseReports
exports.getAbuseReports = function(req, res) {
    service.getAbuseReports(function(err, abuseReports) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'abuseReports': abuseReports,
            metadata : utils.getMetadata(abuseReports.length)
        }
        return res.json(response);
    });
};

exports.getOpenAbuseReports = function(req, res) {
    service.getOpenAbuseReports(function(err, abuseReports) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'abuseReports': abuseReports,
            metadata : utils.getMetadata(abuseReports.length)
        }
        return res.json(response);
    });
};

exports.getClosedAbuseReports = function(req, res) {
    service.getClosedAbuseReports(function(err, abuseReports) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'abuseReports': abuseReports,
            metadata : utils.getMetadata(abuseReports.length)
        }
        return res.json(response);
    });
};

//POST - Save a new AbuseReport
exports.postAbuseReport = function(req, res) {
    var ar = req.body.abuseReport;
    /*
    var isValid = jsonValidator.isAbuseReportValid(ar);
    if (!isValid) {
        callback(new BadRequest("Invalid AbuseReport's json format"));
        return;
    }
    */
    service.saveAbuseReport(ar, function(err, abuseReport) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'abuseReport': abuseReport,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//PUT - Update an AbuseReport
exports.putAbuseReport = function(req, res) {
    var ar = req.body.abuseReport;
    /*
    var isValid = jsonValidator.isAbuseReportValid(ar);
    if (!isValid) {
        callback(new BadRequest("Invalid AbuseReport's json format"));
        return;
    }
    */
    if (ar.idUser != undefined && ar.idUser != null) {
        service.closeAbuseReports(ar.idUser, (err, data) => {
            if (err) {
                return errorHandler.throwError(res, err);
            }
            var response = {
                'data': data,
                metadata : utils.getMetadata(1)
            }
            return res.json(response);
        });
        
        return;
    }
    
    service.updateAbuseReport(ar, function(err, abuseReport) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'abuseReport': abuseReport,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//DELETE - Deletes all AbuseReports
exports.deleteAbuseReports = function(req, res) {
    service.deleteAbuseReports(function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

