var async = require('async');
var matchDao = require('../dao/UserMatchDao');
var utils = require('../utils/Utils');
var NotFound = require("../error/NotFound");
var userDao = require('../dao/UserDao');
var DisabledAccountError = require("../error/DisabledAccountError");

/**
 * Get Matches
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.getUserMatches = function (fbidUser, callback) {
    async.waterfall([
        function getUser(next) {
            userDao.findUser(fbidUser, (err, user) => {
                if (err) {
                    next(err);
                }
                if (user == null) {
                    next(new NotFound("No se encontro el usuario"));
                    return;
                }
                if (! user.control.isActive) {
                    next(new DisabledAccountError());
                    return;
                }
                next();
            });
        },
        function getMatches(next) {            
            matchDao.findMatchs(fbidUser, function (err, matches) {
                if (err) {
                    next(err);
                    return;
                }
                next(null, matches);
            });
        },
        function filterInactiveUsers(matches, next) {
            if (matches.length == 0) {
                next(null, matches);
                return;
            }
            userDao.findInactiveUsers(function (err, inactiveUsers) {
                if (err) {
                    next(err);
                    return;
                }
                matches = matches.filter(function (c) {
                    //console.log('fbid ' + c.fbid + ' is active: ' + isActive(c.fbid, inactiveUsers));
                    return isActive(c.fbid, inactiveUsers);
                });
                next(matches);
            });
        }
    ],
    function (err, response) {
        if (err) {
            callback(err);
            return;
        }
        var response = {
            matches: (value==null||value=="")?[]:value,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};


exports.deleteMatch = function (fbidUser,fbidCandidate,callback){
    async.waterfall([
            function deleteMatchUserCandidate(next){
                matchDao.deleteMatch(fbidUser,fbidCandidate,next);
            },
            function deleteMatchCandidateUser(value,next){
                matchDao.deleteMatch(fbidCandidate,fbidUser,next);
            }],function (err, value) {
                if (err) {
                    callback(err);
                    return;
                }

                var response = {
                    matches: (value==null||value=="")?[]:value,
                    metadata : utils.getMetadata(1)
                }
                callback(null, response);

                return;
             });
}

exports.deleteMatches = function (callback) {
    matchDao.deleteMatchs(callback, function (err, value) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            matches: (value==null||value=="")?[]:value,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

function isActive(idUser, inactiveUsers) {
    for (var u of inactiveUsers) {
        if (u.fbid == idUser) {
            return false;
        }
    }
    return true;
};

