var async = require('async');
var matchDao = require('../dao/UserMatchDao');
var utils = require('../utils/Utils');
var NotFound = require("../error/NotFound");

/**
 * Get Matches
 * @param {String} fbidUser
 * @param {String} fbidCandidate
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserMatches = function (fbidUser, callback) {
    matchDao.findMatchs(fbidUser,callback, function (err, value) {
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
