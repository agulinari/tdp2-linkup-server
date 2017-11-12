'use strict';

var Recommendation = require('../model/Recommendation');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves a Recommendation
 * @param {String} fbidUser User facebook ID.
 * @param {String} fbidCandidate Candidate facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findRecommendation = function (idFromUser,
                                       idToUser,
                                       idRecommendedUser,
                                       callback) {
    var query = {
        "idFromUser": idFromUser,
        "idToUser": idToUser,
        "idRecommendedUser": idRecommendedUser,
    };
    var proj = "-_id -__v";
    Recommendation.findOne(query, proj, function (err, value) {
        callback(err, value);
    });
};

/**
 * Retrieves user's Recommendations
 * @param {String} idUser
 * @param {Function} callback
 **/
exports.findRecommendationsToUser = function(idUser, callback) {
    var query = { "idToUser": idUser };
    var proj = "-_id -__v";
    Recommendation.find(query, proj, function (err, value) {
        callback(err, value);
    });
};

/**
 * Retrieves user's recommended users
 * @param {String} idUser
 * @param {Function} callback
 **/
exports.findRecommendedUsersToUser = function(idUser, callback) {
    var q = { "idToUser": idUser }; // query
    Recommendation.distinct("idRecommendedUser", q, (err, idUsers) => {
        callback(err, idUsers);
    });
};

/**
 * Retrieves Recommendations
 * @param {Function} callback
 **/
exports.findRecommendations = function(callback) {
    var proj = "-_id -__v";
    Recommendation.find(null, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

exports.saveRecommendation = function (idFromUser,
                                       idToUser,
                                       idRecommendedUser,
                                       callback) {
    var newRecommendation = new Recommendation();
    newRecommendation.idFromUser = idFromUser;
    newRecommendation.idToUser = idToUser;
    newRecommendation.idRecommendedUser = idRecommendedUser;
    newRecommendation.save((err, value) => { callback(err, value); });
};

/**
 * Deletes all user's Recommendations
 * @param {String} idUser
 * @param {Function} callback
 **/
exports.deleteUserRecommendationsToUser = function (idToUser,
                                                    idRecommendedUser,
                                                    callback) {
    var query = {
        "idToUser": idToUser,
        "idRecommendedUser": idRecommendedUser
    };
    Recommendation.deleteMany(query, (err, value) => { callback(err, value); });
};

/**
 * Deletes all user's Recommendations
 * @param {String} idUser
 * @param {Function} callback
 **/
exports.deleteRecommendationsToUser = function(idUser, callback) {
    var query = { "idToUser": idUser };
    Recommendation.deleteMany(query, (err, value) => { callback(err, value); });
};

/**
 * Deletes all Recommendations
 * @param {Function} callback
 **/
exports.deleteRecommendations = function(callback) {
    Recommendation.deleteMany((err, value) => { callback(err, value); });
};

