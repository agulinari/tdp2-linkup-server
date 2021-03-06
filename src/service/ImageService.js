var async = require('async');
var userDao = require('../dao/UserDao');
var imageDao = require('../dao/ImageDao');
var NotFound = require("../error/NotFound");

/**
 * Get User's Image by ID
 * @param {String} fbidUser
 * @param {String} idImage
 * @param {Function} callback
 */
exports.getImage = function (fbidUser, idImage, callback) {
    imageDao.findImage(fbidUser, idImage, function (err, image) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, image);
    });
};

/**
 * Get User's Images
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.getImages = function (fbidUser, callback) {
    imageDao.findImages(fbidUser, function (err, images) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, images);
    });
};

/**
 * Get all Images
 * @param {Function} callback
 */
exports.getAllImages = function (callback) {
    imageDao.findAllImages(function (err, images) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, images);
    });
};

/**
 * Save Image
 * @param {String} fbidUser
 * @param {String} idImage
 * @param {String} data
 * @param {Function} callback
 */
exports.saveImage = function (fbidUser, idImage, data, callback) {
    var image = {};
    async.waterfall([
        function getUser(next) {
            userDao.findUser(fbidUser, next);
        },
        function save(user, next) {
            if (user == null) {
		        next(new NotFound("No se encontro el usuario"), null);
                return;
            }
            imageDao.saveImage(fbidUser, idImage, data, next);
        }
    ],
    function (err, image) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, image);
    });
};

/**
 * Delete Image
 * @param {String} fbidUser
 * @param {String} idImage
 * @param {Function} callback
 */
exports.deleteImage = function (fbidUser, idImage, callback) {
    imageDao.deleteImage(fbidUser, idImage, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

/**
 * Delete user's Images
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.deleteImages = function (fbidUser, callback) {
    imageDao.deleteImages(fbidUser, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

/**
 * Delete all Images
 * @param {Function} callback
 */
exports.deleteAllImages = function (callback) {
    imageDao.deleteAllImages(function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

