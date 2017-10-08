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
        }
    ],
    function (err, response) {
        if (err) {
            callback(err);
            return;
        }
        matchDao.findMatchs(fbidUser, function (err, value) {
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
