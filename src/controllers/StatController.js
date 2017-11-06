var service = require('../service/StatService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');

//GET - Returns the User activity stats
exports.getUserActivityStats = function(req, res) {
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
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

//GET - Returns the AbuseReport stats
exports.getAbuseReportStats = function(req, res) {
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
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

