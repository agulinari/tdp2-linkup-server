var service = require('../service/RecommendationService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');

//GET - Returns a Recommendation to user
exports.getRecommendationsToUser = function (req, res) {
    var idUser = req.params.idUser;
    service.getRecommendationsToUser(idUser, (err, recommendations) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'recommendations': recommendations,
            metadata : utils.getMetadata(recommendations.length)
        }
        return res.json(response);
    });
};

//GET - Returns all Recommendations
exports.getRecommendations = function(req, res) {
    service.getRecommendations(function(err, recommendations) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'recommendations': recommendations,
            metadata : utils.getMetadata(recommendations.length)
        }
        return res.json(response);
    });
};

//POST - Insert a new Recommendation in db
exports.postRecommendation = function(req, res) {
    var r = req.body.recommendation;
    /*
    var isValid = jsonValidator.isRecommendationValid(recommendation);
    if (!isValid) {
        callback(new BadRequest("Invalid Recommendation's json format"));
        return;
    }
    */
    service.saveRecommendation(r.idFromUser,
                               r.idToUser,
                               r.idRecommendedUser,
                               (err, recommendation) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'recommendation': recommendation,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//DELETE - Deletes all Recommendations for an User
exports.deleteRecommendationsToUser = function (req, res) {
    var idUser = req.params.idUser;
    service.deleteRecommendationsToUser(idUser, (err, data) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//DELETE - Deletes all User Recommendations for an User
exports.deleteUserRecommendationsToUser = function (req, res) {
    var idToUser = req.params.idToUser;
    var idRecommendedUser = req.params.idRecommendedUser;
    service.deleteUserRecommendationsToUser(idToUser,
                                            idRecommendedUser,
                                            (err, data) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//DELETE - Deletes all Recommendations
exports.deleteRecommendations = function(req, res) {
    service.deleteRecommendations(function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

