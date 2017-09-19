'use strict';

var Link = require('../model/Link');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves a Link
 * @param {String} fbidUser User facebook ID.
 * @param {String} fbidCandidate Candidate facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findLink = function(fbidUser, fbidCandidate, callback) {
    var query = {
        "fbidUser": fbidUser,
        "fbidCandidate": fbidCandidate
    };
    var proj = "fbidUser fbidCandidate time -_id";
    Link.findOne(query, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves user's Links
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findUserLinks = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    var proj = "fbidUser fbidCandidate time -_id";
    Link.find(query, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves Links
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findLinks = function(callback) {
    var proj = "fbidUser fbidCandidate time -_id";
    Link.find(null, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

exports.saveLink = function(fbidUser, fbidCandidate, callback) {
    var newLink = new Link();
    newLink.fbidUser = fbidUser;
    newLink.fbidCandidate = fbidCandidate;
    exports.findLink(fbidUser, fbidCandidate, function (err, link) {
        if (err) {
            callback(err, null);
            return;
        }
        if (link != null) {
            var msg = "User " + fbidUser + ' already linked ' + fbidCandidate;
            callback(new LinkError(msg), null);
            return;
        }
        newLink.save(function(err, value) {
            if (err) {
                callback(err,null);
                return;
            }
            callback(null, value);
        });
    });
};

/**
 * Deletes a Link
 * @param {String} fbidUser User facebook ID.
 * @param {String} fbidCandidate Candidate facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteLink = function(fbidUser, fbidCandidate, callback) {
    var query = {
        "fbidUser": fbidUser,
        "fbidCandidate": fbidCandidate
    };
    Link.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all user's Links
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteUserLinks = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    Link.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all Links
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteLinks = function(callback) {
    Link.deleteMany(function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

