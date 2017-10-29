'use strict';

var User = require('../model/User');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");
var config = require('../config/Config');

/**
 * Retrieves an User
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback
 **/
exports.findUser = function(fbidUser, callback) {
    var query = { "fbid": fbidUser };
    var proj = "-_id";
    User.findOne(query, proj, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves Users
 * @param {Function} callback
 **/
exports.findUsers = function(callback) {
    var proj = "-_id";
    User.find(null, proj, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

exports.findUsersByCriteria = function(criteria, callback) {
    var query = {
        birthday: {
            $lte: criteria.minDate,
            $gte: criteria.maxDate
        },
        "settings.onlyFriends" : criteria.onlyFriends,
        "settings.invisible" : criteria.invisible,
        "control.isActive" : criteria.isActive
    };
    if (!criteria.searchMales || !criteria.searchFemales) {
        query.gender = criteria.searchMales ? 'male' : 'female';
    }

    User.find(query, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
	    if(value == null){
		    callback(new NotFound("find value es null"));
		    return;
	    }
        callback(null, value);
    });
};

// TODO: usar by Criteria, hay que modificar gender condition
exports.findInactiveUsers = function(callback) {
    var query = { "control.isActive" : false };
    User.find(query, (err, value) => {
        if (err) {
            callback(err, null);
            return;
        }
	    if(value == null){
		    callback(new NotFound("Inactive users es null"));
		    return;
	    }
        callback(null, value);
    });
};

exports.saveUser = function(userData, callback) {
    var newUser = new User(userData);
    newUser.save((err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

exports.updateUser = function(userData, callback) {
    var newUserData = Object.assign({}, userData);
    User.findOneAndUpdate({"fbid":userData.fbid}, newUserData, (err) => {
        if (err) {
            callback(err);
            return;
		}
        callback(null, newUserData);
	});
};

exports.updateToken = function (fbid, token, callback) {
    User.update({ fbid: fbid },
                { $set: { 'users.$.control.token': token} },
                null,
                (err, count) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, count);
                });
}

exports.decrementSuperlinkCounter = function (user, callback) {
    User.update({ fbid: user.fbid },
                { $set: { 'users.$.control.availableSuperlinks': (user.control.availableSuperlinks - 1) } },
                null,
                (err, count) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback(null, count);
                });
}

exports.resetSuperlinkCounter = function (callback) {
    User.update(null,
                {
                    $set: {
                        "control.availableSuperlinks": config.app.superlinkCount
                    }
                },
                { multi: true },
                (err, value) => {
                    if (err) {
                        callback(err, null);
                        return;
		            }
                    callback(null, value);
	            });
};

/**
 * Deletes an User
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback
 **/
exports.deleteUser = function (fbidUser, callback) {
    var query = { "fbid": fbidUser };
    User.deleteMany(query, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all Users
 * @param {Function} callback
 **/
exports.deleteAllUsers = function(callback) {
    User.deleteMany(null, (err, value) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null, value);
    });
};

