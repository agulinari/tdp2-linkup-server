var userDao = require('../dao/UserDao');
var imageDao = require('../dao/ImageDao');
var utils = require('../utils/Utils');
var async = require('async');
var BadRequest = require("../error/BadRequest");
var NotFound = require("../error/NotFound");
var jsonValidator = require('../utils/JsonValidator');

/**
 * Get Users
 * @param {Function} callback
 */
exports.getUsers = function (callback) {
    userDao.findUsers(function (err, users) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, users);
    });
};

/**
 * Get User by ID
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.getUser = function (fbidUser, callback) {
    userDao.findUser(fbidUser, function (err, user) {
        if (err) {
            callback(err, null);
            return;
        }
        if (user == null) {
            err = new NotFound("No se encontro el usuario");
            callback(err, null);
            return;
        }
        
        imageDao.findImages(fbidUser, function(err, images) {
            if (err) {
                callback(err, null);
                return;
            }
            user = user.toObject();
            var index = getImageIndex(user.avatar.image.idImage, images);
            user.avatar.image.data = images[index].data;
            user.images.forEach(function(e) {
                var idImage = e.image.idImage;
                index = getImageIndex(e.image.idImage, images);
                if (index != null) {
                    e.image.data = images[index].data;
                }
            });
            callback(null, user);	    
        });

    });
};

function getImageIndex(idImage, images) {
    for (var i= 0; i < images.length; ++i) {
        if (images[i].idImage == idImage) {
            return i;
        }
    }
    return null;
}

/**
 * Save User
 * @param {object} userData
 * @param {Function} callback
 */
exports.saveUser = function (userData, callback) {
    async.waterfall([
        function getUser(next) {
            userDao.findUser(userData.fbid, next);
        },
        function save(user, next) {
            if (user != null) {
                err = new BadRequest("El usuario ya existe");
                next(err, null);
                return;
            }
            user = {
                birthday: userData.birthday,
                comments: userData.comments,
                education: userData.education,
                fbid: userData.fbid,
                token: userData.token,
                firstName: userData.firstName, 
                location: {
                    longitude: userData.location.longitude,
                    latitude: userData.location.latitude,
                    name: userData.location.name
                },
                gender: userData.gender,
                avatar: {image: {idImage: userData.avatar.image.idImage}},
                images: [],
                interests : userData.interests,
                lastName: userData.lastName,
                occupation: userData.occupation,
                settings: userData.settings,
                control : userData.control
            };
            userData.images.forEach(function(e) {
                user.images.push({image: {idImage: e.image.idImage}});
            });
            userDao.saveUser(user, next);
        },
        function saveImages(user, next) {
            imageDao.saveImage(user.fbid,
                               user.avatar.image.idImage,
                               userData.avatar.image.data,
                               function(err, image) {
                if (err) {
                    next(err,null);
                    return;
                }
                if (0 == userData.images.length) {
                    next(null, user);
                    return;
                }
                var i = 0;
                var imageCallback = function(err, image) {
                    if (err) {
                        next(err,null);
                        return;
                    }
                    ++i;
                    if (i >= userData.images.length) {
                        next(null, user);
                        return;
                    }
                    imageDao.saveImage(user.fbid,
                                       userData.images[i].image.idImage,
                                       userData.images[i].image.data,
                                       imageCallback);
                }
                imageDao.saveImage(user.fbid,
                                   userData.images[i].image.idImage,
                                   userData.images[i].image.data,
                                   imageCallback);
            });
        },
    ],
    function (err, user) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, user);
    });
};

/**
 * Update User
 * @param {object} userData
 * @param {Function} callback
 */
exports.updateUser = function (userData, callback) {
    async.waterfall([
        function getUser(next) {
            userDao.findUser(userData.fbid, next);
        },
        function update(user, next) {
            if (user == null) {
                err = new NotFound("No se encontro el usuario");
                next(err, null);
                return;
            }
            user = {
                birthday: userData.birthday != undefined
                            ? userData.birthday
                            : user.birthday,
                comments: userData.comments != undefined
                            ? userData.comments
                            : user.comments,
                education: userData.education != undefined
                            ? userData.education
                            : user.education,
                fbid: user.fbid,
                token: userData.token != undefined
                            ? userData.token
                            : user.token,
                firstName: userData.firstName != undefined
                            ? userData.firstName
                            : user.firstName,
                location: userData.location != undefined
                            ? userData.location
                            : user.location,
                gender: userData.gender != undefined
                            ? userData.gender
                            : user.gender,
                avatar: userData.avatar != undefined
                            ? userData.avatar
                            : user.avatar,
                images: user.images,
                interests : userData.interests != undefined
                            ? userData.interests
                            : user.interests,
                lastName: userData.lastName != undefined
                            ? userData.lastName
                            : user.lastName,
                occupation: userData.occupation != undefined
                            ? userData.occupation
                            : user.occupation,
                settings: userData.settings != undefined
                            ? userData.settings
                            : user.settings,
                control: user.control
            };
            if (userData.images != undefined) {
                user.images = [];
                userData.images.forEach(function(e) {
                    user.images.push({image: {idImage: e.image.idImage}});
                });
            }
            if (userData.control != undefined) {
                if (userData.control.isActive != undefined) {
                    if (userData.control.isActive == true
                            && user.control.isActive == false) {
                        console.log('HIT 1');
                        user.control.isActive = true;
                        user.control.deactivationTime = null;
                    } else if (userData.control.isActive == false
                            && user.control.isActive == true) {
                        console.log('HIT 2');
                        user.control.isActive = false;
                        user.control.deactivationTime = new Date();
                    }
                }
            }
                        
            userDao.updateUser(user, next);
        }    
    ],
    function (err, user) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, user);
    });
};

exports.updateToken = function(fbid,token,callback){
    userDao.updateToken(fbid, function(err, data){
                if (err) {
                    callback(err, null);
                    return;
                }
        callback(null, data);
    });
}

/**
 * Delete User
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.deleteUser = function (fbidUser, callback) {
    userDao.deleteUser(fbidUser, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        imageDao.deleteImages(fbidUser, function (err, data2) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, data);
        });
    });
};

/**
 * Delete Users
 * @param {Function} callback
 */
exports.deleteAllUsers = function (callback) {
    userDao.deleteAllUsers(function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        imageDao.deleteAllImages(function (err, data2) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, data);
        });
    });
};


