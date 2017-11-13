var firebaseService = require('./FirebaseService');
var userDao = require('../dao/UserDao');
var imageDao = require('../dao/ImageDao');
var utils = require('../utils/Utils');
var async = require('async');
var BadRequest = require("../error/BadRequest");
var NotFound = require("../error/NotFound");

/**
 * Get Users
 * @param {Function} callback
 */
exports.getUsers = function (callback) {
    userDao.findUsers((err, users) => {
        if (err) {
            callback(err);
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
    userDao.findUser(fbidUser, (err, user) => {
        if (err) {
            callback(err);
            return;
        }
        if (user == null) {
            callback(new NotFound("No se encontro el usuario"));
            return;
        }
        
        callback(null, user);
        
        /*
        imageDao.findImages(fbidUser, (err, images) => {
            if (err) {
                callback(err);
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
        */
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
        // Test for user existence
        function (next) {
            userDao.findUser(userData.fbid, (err, user) => {
                if (user != null) {
                    next(new BadRequest("El usuario ya existe"));
                    return;
                }
                next(err, user);
            });
        },
        // Save user
        function (user, next) {            
            user = {
                fbid     : userData.fbid,
                birthday : userData.birthday,
                comments : userData.comments,
                education: userData.education,
                firstName: userData.firstName,
                lastName : userData.lastName,
                location : {
                    longitude: userData.location.longitude,
                    latitude : userData.location.latitude,
                    name     : userData.location.name
                },
                gender    : userData.gender,
                avatar    : {image: {idImage: userData.avatar.image.idImage}},
                images    : [],
                interests : userData.interests,
                occupation: userData.occupation,
                settings  : userData.settings,
                control   : userData.control
            };
            userData.images.forEach(function(e) {
                user.images.push({image: {idImage: e.image.idImage}});
            });
            userDao.saveUser(user, next);
        },
        // Save images
        function (user, next) {
            imageDao.saveImage(user.fbid,
                               user.avatar.image.idImage,
                               userData.avatar.image.data,
                               function(err, image) {
                if (err) {
                    next(err);
                    return;
                }
                if (0 == userData.images.length) {
                    next(null, user);
                    return;
                }
                var i = 0;
                var imageCallback = function(err, image) {
                    if (err) {
                        next(err);
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
        // Test for user existence
        function (next) {
            userDao.findUser(userData.fbid, (err, user) => {
                if (user == null) {
                    next(new NotFound("No se encontro el usuario"));
                    return;
                }
                next(err, user);
            });
        },
        // Update user
        function update(user, next) {        
            user = {
                      fbid: user.fbid,
                  birthday: userData.birthday != undefined
                                ? userData.birthday
                                : user.birthday,
                  comments: userData.comments != undefined
                                ? userData.comments
                                : user.comments,
                 education: userData.education != undefined
                                ? userData.education
                                : user.education,
                 firstName: userData.firstName != undefined
                                ? userData.firstName
                                : user.firstName,
                  lastName: userData.lastName != undefined
                                ? userData.lastName
                                : user.lastName,
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
                 interests: userData.interests != undefined
                                ? userData.interests
                                : user.interests,
                occupation: userData.occupation != undefined
                                ? userData.occupation
                                : user.occupation,
                  settings: userData.settings != undefined
                                ? userData.settings
                                : user.settings,
                   control: user.control
            };

            var updateImages = (userData.images != undefined
                    && userData.images[0].image.data != undefined);
            if (updateImages) {
                user.images = [];
                userData.images.forEach(function(e) {
                    user.images.push({image: {idImage: e.image.idImage}});
                });
            }
            if (userData.control != undefined) {
                if (userData.control.isPremium != undefined) {
                    user.control.isPremium = userData.control.isPremium;
                }
                if (userData.control.token != undefined) {
                    user.control.token = userData.control.token;
                }
                if (userData.control.isActive != undefined) {
                    if (userData.control.isActive == true
                            && user.control.isActive == false) {
                        user.control.isActive = true;
                        user.control.deactivationTime = null;
                    } else if (userData.control.isActive == false
                            && user.control.isActive == true) {
                        user.control.isActive = false;
                        user.control.deactivationTime = new Date();
                        
                        // TODO: async call response should not be ignored
                        firebaseService.notifyUser(user.fbid,
                                                   '',
                                                   '',
                                                   '',
                                                   '',
                                                   'Ban',
                                                   () => {
                                                       console.log('user ' + user.fbidTo + ' notification sent <BAN>');
                                                   });
                    }
                }
            }
                        
            userDao.updateUser(user, next);
        },
        // Delete images images
        function (user, next) {
            if (userData.images == undefined || userData.images.length == 0) {
                next(null, user);
                return;
            }
            imageDao.deleteImages(user.fbid, (err, data) => {
                next(null, user);
            });
        },
        // Save images
        function (user, next) {
            if (userData.images == undefined
                    || userData.images.length == 0
                    || userData.images[0].image.data != undefined) {
                next(null, user);
                return;
            }
            imageDao.saveImage(user.fbid,
                               userData.avatar.image.idImage,
                               userData.avatar.image.data,
                               (err, image) => {
                if (err) {
                    next(err);
                    return;
                }
                if (0 == userData.images.length) {
                    next(null, user);
                    return;
                }
                var i = 0;
                var imageCallback = function(err, image) {
                    if (err) {
                        next(err);
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

exports.updateToken = function(fbid,token,callback){
    userDao.updateToken(fbid, (err, data) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, data);
    });
}

/**
 * Reinit Superlink counter to all Users
 * @param {Function} callback
 */
exports.resetSuperlinkCounter = function (callback) {
    async.waterfall([
        function (next) {
            userDao.resetSuperlinkCounter(next);
        }
    ],
    function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }
        callback(null, data);
    });
};

/**
 * Delete User
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.deleteUser = function (fbidUser, callback) {
    userDao.deleteUser(fbidUser, (err, data) => {
        if (err) {
            callback(err);
            return;
        }
        imageDao.deleteImages(fbidUser, (err, data2) => {
            if (err) {
                callback(err);
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
exports.deleteUsers = function (callback) {
    userDao.deleteAllUsers((err, data) => {
        if (err) {
            callback(err);
            return;
        }
        imageDao.deleteAllImages((err, data2) => {
            if (err) {
                callback(err);
                return;
            }
            callback(null, data);
        });
    });
};

