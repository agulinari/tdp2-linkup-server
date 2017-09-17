var async = require('async');
var utils = require('../utils/Utils');
var userDao = require('../dao/UserProfileDao');
var candidateDao = require('../dao/CandidateDao');
var GeoPoint = require('geopoint');
var NotFound = require("../error/NotFound");

exports.getCandidates = function (id, callback) {
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

function canBeCandidate(user, candidate) {
    //use the min distance
    var distance = user.settings.maxDistance < candidate.settings.maxDistance
                   ? user.settings.maxDistance : candidate.settings.maxDistance;
    
    /*
     * Test
     * obelisco {latitude: -34.603800, longitude: -58.381576}
     * casa rosada {latitude: -34.608074, longitude: -58.370289}
     * distancia = 1,4 km approx
     */
    return satisfiesCandidateCriteria(user, candidate)
           && isCloseEnough(distance, user.location, candidate.location);
};

function satisfiesCandidateCriteria(user, candidate) {
    if (!candidate.settings.searchMales && user.gender == 'male') {
        return false;
    }
    if (!candidate.settings.searchFemales && user.gender == 'female') {
        return false;
    }
    if (candidate.settings.onlyFriends && !user.settings.onlyFriends) {
        return false;
    }
    
    //User age is in the candidate age range
    if (user.birthdate < getDateFromAge(candidate.birthday,
                                        candidate.settings.minAge)) {
        return false;
    }
    if (user.birthdate > getDateFromAge(candidate.birthday,
                                        candidate.settings.maxAge)) {
        return false;
    }
    return true;
};

function isCloseEnough(distance, loc1, loc2) {
    var gp1 = new GeoPoint(loc1.latitude, loc1.longitude, false);   // in radian
    var gp2 = new GeoPoint(loc2.latitude, loc2.longitude, false);   // in radian   
    return gp1.distanceTo(gp2, true) <= distance;   // in kilometers
};

function getDateFromAge(birthdate, age) {
    //birthdate: yyyy/mm/dd
    var day = birthdate.substring(8);
    var month = birthdate.substring(5, 7);
    var year = birthdate.substring(0, 4);
    return (new Date().getFullYear() - age) + '/' + month + '/' + day;
};

