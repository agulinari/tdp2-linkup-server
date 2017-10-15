'use strict';

var Ad = require('../model/Ad');

/**
 * Retrieves all Ads
 * @param {Function} callback
 **/
exports.findAllAds = function(callback) {
    var proj = "-__v";
    Ad.find(null, proj, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves an Ad by ID
 * @param {Function} callback
 **/
exports.findAdById = function(idAd, callback) {
    var proj = "-__v";
    Ad.findOne({ _id: idAd }, proj, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves Ads by criteria
 * @param {Object} criteria
 * @param {Function} callback
 **/
exports.findAdsByCriteria = function(criteria, callback) {
    var query = {};
    if (criteria.isOpen != undefined) {
        query.isactive = criteria.isActive;
    }
    
    var proj = "-__v";
    Ad.find(query, proj, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

exports.saveAd = function(adData, callback) {
    var newAd = new Ad(adData);
    newAd.save((err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

exports.updateAd = function(adData, callback) {
    var newAdData = Object.assign({}, adData);
    Ad.findOneAndUpdate({_id:adData._id},
                         newAdData,
                         {
                            projection: '-__v',
                            new: true //returnNewDocument
                         },
                         (err, value) => {
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
exports.deleteAllAds = function(callback) {
    Ad.deleteMany(null, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};


