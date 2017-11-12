var async = require('async');
var userDao = require('../dao/UserDao');
var recommendationDao = require('../dao/RecommendationDao');
var activityLogService = require('./ActivityLogService');
var RecommendationError = require("../error/RecommendationError");
var NotFound = require("../error/NotFound");

/**
 * Get Recommendation
 * @param {String idFromUser
 * @param {String idToUser
 * @param {String idRecommendedUser
 * @param {Function} callback
 */
exports.getRecommendation = function (idFromUser,
                                      idToUser,
                                      idRecommendedUser,
                                      callback) {
    recommendationDao.findRecommendation(idFromUser,
                                         idToUser,
                                         idRecommendedUser,
                                         (err, recommendation) => {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'recommendation': recommendation,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Get Recommendations for User
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.getRecommendationsToUser = function (idUser, callback) {
    recommendationDao.findRecommendationsToUser(idUser,
                                                (err, recommendations) => {
        callback(err, recommendations);
    });
};

/**
 * Get Recommendations for User
 * @param {String} fbidUser
 * @param {Function} callback
 */
exports.getRecommendedUsersToUser = function (idUser, callback) {
    recommendationDao.findRecommendedUsersToUser(idUser,
                                                (err, idUsers) => {
        callback(err, idUsers);
    });
};

/**
 * Get Recommendations
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getRecommendations = function (callback) {
    recommendationDao.findRecommendations((err, recommendations) => {
        callback(err, recommendations);
    });
};

/**
 * Save Recommendation
 * @param {String fromUser
 * @param {String toUser
 * @param {String recommendedUser
 * @param {Function} callback
 */
exports.saveRecommendation = function (idFromUser,
                                       idToUser,
                                       idRecommendedUser,
                                       callback) {
    var fromUser = {};
    var toUser = {};
    var recommendedUser = {};
    var recommendation = {};
    async.waterfall([
        // Find from User
        function (next) {
            userDao.findUser(idFromUser, (err, user) => {
                if (err) {
                    next(err, null);
                    return;
                }
                if (user == null) {
		            next(new NotFound("No se encontro el emisor"), null);
                    return;
                }
                fromUser = user;
                next(null, fromUser);
            });
        },
        // Find to User
        function (fromUser, next) {
            userDao.findUser(idToUser, (err, user) => {
                if (err) {
                    next(err, null);
                    return;
                }
                if (user == null) {
		            next(new NotFound("No se encontro el receptor"), null);
                    return;
                }
                toUser = user;
                next(null, toUser);
            });
        },
        // Find recommended User
        function (toUser, next) {
            userDao.findUser(idRecommendedUser, (err, user) => {
                if (err) {
                    next(err, null);
                    return;
                }
                if (user == null) {
		            next(new NotFound("No se encontro el recomendado"), null);
                    return;
                }
                recommendedUser = user;
                next(null, recommendedUser);
            });
        },
        // Log activity
        function (response, next) {
            user = response;
            if (user == null) {
		        next(new NotFound("No se encontro el usuario"), null);
                return;
            }
            
            var activityLog = {
                idUser: user.fbid,
                isPremium: user.control.isPremium,
                activityType: 3
            };
            activityLogService.saveActivityLog(activityLog,
                                               (err, activityLog) => {
                if (err) {
                    next(err, null);
                    return;
                }
                next(null, activityLog);
            });
        },
        // Find existing Recommendation
        function (activityLog, next) {
            recommendationDao.findRecommendation(idFromUser,
                                                 idToUser,
                                                 idRecommendedUser,
                                                 (err, recommendation) => {     
                next(err, recommendation);
            });
        },
        // Save Recomendation
        function (recommendation, next) {
            if (recommendation != null) {
		        next(null, recommendation);
                return;
            }
            recommendationDao.saveRecommendation(idFromUser,
                                                 idToUser,
                                                 idRecommendedUser,
                                                 (err, recommendation) => {                
                next(err, recommendation);
            });
        }
    ],
    function (err, recommendation) {
        callback(err, recommendation);
    });
};

/**
 * Delete all Recommendations to User
 * @param {String} idUser
 * @param {Function} callback
 */
exports.deleteRecommendationsToUser = function (idUser, callback) {
    recommendationDao.deleteRecommendationsToUser(idUser, (err, data) => {
        callback(err, data);
    });
};

/**
 * Delete all User Recommendations to User
 * @param {String} idToUser
  * @param {String} idRecommendedUser
 * @param {Function} callback
 */
exports.deleteUserRecommendationsToUser = function (idToUser,
                                                    idRecommendedUser,
                                                    callback) {
    recommendationDao.deleteUserRecommendationsToUser(idToUser,
                                                      idRecommendedUser,
                                                      (err, data) => {
        callback(err, data);
    });
};

/**
 * Delete all Recommendations
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteRecommendations = function (callback) {
    recommendationDao.deleteRecommendations((err, data) => {
        callback(err, data);
    });
};

