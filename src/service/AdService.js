var async = require('async');
var adDao = require('../dao/AdDao');
var NotFound = require("../error/NotFound");

/**
 * Get all Ads
 * @param {Function} callback
 */
exports.getAds = function (callback) {
    adDao.findAllAds((err, ads) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, ads);
    });
};

/**
 * Save Ad
 * @param {Object} adData
 * @param {Function} callback
 */
exports.saveAd = function (adData, callback) {
    async.waterfall([
        function save(next) {
            ad = {
                advertiser: adData.advertiser,
                image: adData.image,
                url: adData.url,
                isActive: adData.isActive != undefined
                              ? adData.isActive
                              : true
            };
            adDao.saveAd(ad, (err, ad) => {
                if (err) {
                    next(err);
                    return;
                }
                next(null, ad);
            });
        }
    ],
    function (err, ad) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, ad);
    });
};

/**
 * Update Ad
 * @param {Object} adData
 * @param {Function} callback
 */
exports.updateAd = function (adData, callback) {
    async.waterfall([
        function getAd(next) {
            adDao.findAdById(adData._id, (err, ad) => {
                if (err) {
                    next(err);
                    return;
                }
                if (ad == null) {
                    var msg = `No se encontro la publicidad con id ${_id}`;
		            next(new NotFound(msg), null);
                    return;
                }
                next(null, ad);
            });
        },
        function update(ad, next) {
            ad = {
                       _id: ad._id,
                advertiser: adData.advertiser != undefined
                                ? adData.advertiser
                                : ad.advertiser,
                     image: adData.image != undefined
                                ? adData.image
                                : ad.image,
                       url: adData.url != undefined
                                ? adData.url
                                : ad.url,
                  isActive: adData.isActive != undefined
                              ? adData.isActive
                              : ad.isActive
            };
            adDao.updateAd(ad, (err, ad) => {
                if (err) {
                    console.log(err);
                    next(err);
                    return;
                }
                next(null, ad);
            });
        }
    ],
    function (err, ad) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, ad);
    });
};

/**
 * Delete all Ads
 * @param {Function} callback
 */
exports.deleteAds = function (callback) {
    adDao.deleteAllAds((err, data) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

