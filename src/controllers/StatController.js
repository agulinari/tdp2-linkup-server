var service = require('../service/StatService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');

//GET - Returns the User activity stats
exports.getUserActivityStats = function(req, res) {
    var fromDate = req.query.from;
    var toDate = req.query.to;
    service.getUserActivityStats(fromDate, toDate, (err, stats) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'stats': stats,
            metadata : utils.getMetadata(stats.length)
        }
        return res.json(response);
    });
};

//GET - Returns the User base status
exports.getUserActiveBlockedStats = function(req, res) {
    service.getUserActiveBlockedStats((err, stats) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'stats': stats,
            metadata : utils.getMetadata(stats.length)
        }
        return res.json(response);
    });
};

//GET - Returns the User base status
exports.getUserPremiumBasicByActiveStatusStats = function(req, res) {
    var isActive = (req.query.isActive == 'true');
    service.getUserPremiumBasicByActiveStatusStats(isActive, (err, stats) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'stats': stats,
            metadata : utils.getMetadata(stats.length)
        }
        return res.json(response);
    });
};

//GET - Returns the AbuseReport stats
exports.getAbuseReportStats = function(req, res) {
    var fromDate = req.query.from;
    var toDate = req.query.to;
    service.getAbuseReportStats(fromDate, toDate, (err, stats) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'stats': stats,
            metadata : utils.getMetadata(stats.length)
        }
        return res.json(response);
    });
};

