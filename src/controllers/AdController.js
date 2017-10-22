var service = require('../service/AdService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');

//GET - Returns the Ads
exports.getAds = function(req, res) {
    service.getAds(function(err, ads) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'ads': ads,
            metadata : utils.getMetadata(ads.length)
        }
        return res.json(response);
    });
};


//POST - Save a new Ad
exports.postAd = function(req, res) {
    var adBody = req.body.ad;
    /*
    var isValid = jsonValidator.isAdValid(adBody);
    if (!isValid) {
        callback(new BadRequest("Invalid Ad's json format"));
        return;
    }
    */
    service.saveAd(adBody, function(err, ad) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'ad': ad,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//PUT - Update an Ad
exports.putAd = function(req, res) {
    var adBody = req.body.ad;
    /*
    var isValid = jsonValidator.isAdValid(adBody);
    if (!isValid) {
        callback(new BadRequest("Invalid Ad's json format"));
        return;
    }
    */
    service.updateAd(adBody, function(err, ad) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'ad': ad,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//DELETE - Deletes all Ads
exports.deleteAds = function(req, res) {
    service.deleteAds(function(err, data) {
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

