'use strict';

var User = require('../model/User');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves an User
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback
 **/
exports.findUser = function(fbidUser, callback) {
    var query = {
        "fbid": fbidUser,
    };
    var proj = "-_id";
    User.findOne(query, proj, function (err, value) {
        if (err) {
            callback(err, null);
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
    User.find(null, proj, function (err, value) {
        if (err) {
            callback(err, null);
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
        "settings.invisible" : criteria.invisible
    };
    if (!criteria.searchMales || !criteria.searchFemales) {
        query.gender = criteria.searchMales ? 'male' : 'female';
    }

    //console.log('query: ' + JSON.stringify(query));
    User.find(query, function (err, value) {
        if (err) {
            callback(err, null);
            return;
        }
	    if(value == null){
		    callback(new NotFound("find value es null"), null);
		    return;
	    }
        callback(null, value);
    });
};

exports.saveUser = function(userData, callback) {
    var newUser = new User(userData);
    newUser.save(function(err, value) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, value);
    });
};

exports.updateUser = function(userData, callback) {
    var newUserData = Object.assign({}, userData);
    User.findOneAndUpdate({"fbid":userData.fbid}, newUserData, function(err){
        if(err){
            callback(err, null);
            return;
		}
        callback(null, newUserData);
	});
};

exports.updateToken = function(fbid,token,callback){
    User.update(
    {
        fbid: fbid
    },
    {
        $set: { 'users.$.token': token}
    }, function(err, count) {
           if (err){
            callback(err, null);
            return;
           }
           callback(null, count);
    });
}

/**
 * Deletes an User
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback
 **/
exports.deleteUser = function(fbidUser, callback) {
    var query = {
        "fbid": fbidUser,
    };
    User.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
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
    User.deleteMany(null, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

