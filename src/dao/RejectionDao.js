'use strict';

var Rejection = require('../model/Rejection');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves a Rejection
 * @param {String} fbidUser User facebook ID.
 * @param {String} fbidCandidate Candidate facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findRejection = function(fbidUser, fbidCandidate, callback) {
    var query = {
        "fbidUser": fbidUser,
        "fbidCandidate": fbidCandidate
    };
    var proj = "fbidUser fbidCandidate -_id";
    Rejection.findOne(query, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);        
    });
};

/**
 * Retrieves user's Rejections
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findUserRejections = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    var proj = "fbidUser fbidCandidate -_id";
    Rejection.find(query, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);        
    });
};

/**
 * Retrieves Rejections
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findRejections = function(callback) {
    var proj = "fbidUser fbidCandidate -_id";
    Rejection.find(null, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);        
    });
};

exports.saveRejection = function(fbidUser, fbidCandidate, callback) {
    var newRejection = new Rejection();
    newRejection.fbidUser = fbidUser;
    newRejection.fbidCandidate = fbidCandidate;
    exports.findRejection(fbidUser, fbidCandidate, function (err, rejection) {
        if (err) {
            callback(err, null);
            return;
        }
        if (rejection != null) {
            var msg = "User " + fbidUser + ' already rejected ' + fbidCandidate;
            callback(new RejectionError(msg), null);
            return;
        }
        newRejection.save(function(err, value) {
            if (err) {
                callback(err,null);
                return;
            }
            callback(null, value); 
        });
    });
};

/**
 * Deletes a Rejection
 * @param {String} fbidUser User facebook ID.
 * @param {String} fbidCandidate Candidate facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteRejection = function(fbidUser, fbidCandidate, callback) {
    var query = {
        "fbidUser": fbidUser,
        "fbidCandidate": fbidCandidate
    };
    Rejection.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);        
    });
};

/**
 * Deletes all user's Rejections
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteUserRejections = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    Rejection.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);        
    });
};

/**
 * Deletes all Rejections
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteRejections = function(callback) {
    Rejection.deleteMany(function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);        
    });
};

