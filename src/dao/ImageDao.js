'use strict';

var Image = require('../model/Image');
var ImageError = require("../error/ImageError");

/**
 * Retrieves an Image
 * @param {String} fbidUser User facebook ID.
 * @param {String} idImage Candidate facebook ID.
 * @param {Function} callback
 **/
exports.findImage = function(fbidUser, idImage, callback) {
    var query = {
        "fbidUser": fbidUser,
        "idImage": idImage
    };
    var proj = "fbidUser idImage data -_id";
    Image.findOne(query, proj, function (err, value) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves user's Images
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findImages = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    var proj = "fbidUser idImage data -_id";
    Image.find(query, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves all Images
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findAllImages = function(callback) {
    var proj = "fbidUser idImage data -_id";
    Image.find(null, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

exports.saveImage = function(fbidUser, idImage, data, callback) {
    var newImage = new Image();
    newImage.fbidUser = fbidUser;
    newImage.idImage = idImage;
    newImage.data = data;
    exports.findImage(fbidUser, idImage, function (err, image) {
        if (err) {
            callback(err, null);
            return;
        }
        if (image != null) {
            var msg = "User " + fbidUser + ' already got image ' + idImage;
            callback(new ImageError(msg), null);
            return;
        }
        newImage.save(function(err, value) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, value);
        });
    });
};

/**
 * Deletes an Image
 * @param {String} fbidUser User facebook ID.
 * @param {String} idImage Image ID.
 * @param {Function} callback
 **/
exports.deleteImage = function(fbidUser, idImage, callback) {
    var query = {
        "fbidUser": fbidUser,
        "idImage": idImage
    };
    Image.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all user's Images
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback
 **/
exports.deleteImages = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    Image.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all Images
 * @param {Function} callback
 **/
exports.deleteAllImages = function(callback) {
    Image.deleteMany(null, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

