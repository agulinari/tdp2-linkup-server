var async = require('async');
var utils = require('../utils/Utils');
var userDao = require('../dao/UserProfileDao');
var candidateDao = require('../dao/CandidateDao');
var NotFound = require("../error/NotFound");

exports.getImage = function (idUser, idImage, callback) {
    var user = {};
    async.waterfall([
        function getUser(next) {
            userDao.getUserProfileById(id, next);
        },
        function getCandidatesByUserCriteria(response, next) {
            user = response;
            if (user == null) {
		        next(new NotFound("No se encontro el usuario"), null);
                return;
            }
            var criteria = {
                searchMales : user.settings.searchMales,
                searchFemales : user.settings.searchFemales,
                onlyFriends : user.settings.onlyFriends,
                minDate : getDateFromAge(user.birthday, user.settings.minAge),
                maxDate : getDateFromAge(user.birthday, user.settings.maxAge),
                invisible : false
            };
            candidateDao.getUserProfileByCriteria(criteria, next);
        },
        function filterByCandidateCriteria(response, next) {
            var users = response;
            var candidates = [];
            users.forEach(function (candidate) {
                if (canBeCandidate(user, candidate)) {
                    candidates.push(candidate);
                }
            });
            next(null, candidates);
        },
        function filterRejectedCandidates(candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            console.log('TODO: filtrar candidatos rechazados');
            next(null, candidates);
        },
        function filterLinkedCandidates(candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            console.log('TODO: filtrar candidatos linkeados');
            next(null, candidates);
        },
        function filterMatchedCandidates(candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            console.log('TODO: filtrar candidatos matcheados');
            next(null, candidates);
        }
    ],
    function (err, response) {
        if (err) {
            callback(err);
            return;
        }
        var response = {
            'candidates': response,
            metadata : utils.getMetadata(response.length)
        }
        callback(null, response);
    });
};


