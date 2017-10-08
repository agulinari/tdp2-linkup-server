var async = require('async');
var utils = require('../utils/Utils');
var userDao = require('../dao/UserDao');
var rejectionDao = require('../dao/RejectionDao');
var blockService = require('./BlockService');
var linkDao = require('../dao/LinkDao');
var GeoPoint = require('geopoint');
var NotFound = require("../error/NotFound");
var DisabledAccountError = require("../error/DisabledAccountError");

exports.getCandidates = function (id, callback) {
    var user = {};
    async.waterfall([
        function getUser(next) {
            userDao.findUser(id, (err, user) => {
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
                next(null, user);
            });
        },
        function getCandidatesByUserCriteria(response, next) {
            console.log('user: ' + JSON.stringify(response));
            user = response;
            
            var now = new Date();
            var now_str = now.getFullYear() + '/'
                + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '/'
                + (now.getDate() < 10 ? '0' : '') + now.getDate();
            var criteria = {
                searchMales : user.settings.searchMales,
                searchFemales : user.settings.searchFemales,
                onlyFriends : user.settings.onlyFriends,
                minDate : getDateFromAge(now_str, user.settings.minAge),
                maxDate : getDateFromAge(now_str, user.settings.maxAge),
                invisible : false,
                isActive: true
            };
            userDao.findUsersByCriteria(criteria, next);
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
            rejectionDao.findUserRejections(user.fbid, function (err, rejections) {
                if (err) {
                    next(err, null);
                    return;
                }

                candidates = candidates.filter(function (c) {
                    return !isRejected(c.fbid, rejections);
                });
                next(null, candidates);
            });
        },
        function filterCandidatesRejections(candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            rejectionDao.findWhoRejectedUser(user.fbid, function (err, rejections) {
                if (err) {
                    next(err, null);
                    return;
                }
                                
                candidates = candidates.filter(function (c) {
                    return !didReject(c.fbid, rejections);
                });
                next(null, candidates);
            });
        },
        function filterBlockedCandidates(candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            blockService.getUserBlocks(user.fbid, function (err, blocks) {
                if (err) {
                    next(err, null);
                    return;
                }

                candidates = candidates.filter(function (c) {
                    return !isBlocked(c.fbid, blocks);
                });
                next(null, candidates);
            });
        },
        function filterCandidatesBlocks(candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            blockService.getUsersBlockingUser(user.fbid, function (err, blocks) {
                if (err) {
                    next(err, null);
                    return;
                }
                                
                candidates = candidates.filter(function (c) {
                    return !didBlock(c.fbid, blocks);
                });
                next(null, candidates);
            });
        },
        function filterLinkedCandidates(candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            linkDao.findUserLinks(user.fbid, function (err, links) {
                if (err) {
                    next(err, null);
                    return;
                }
                
                candidates = candidates.filter(function (c) {
                    return !isLinked(c.fbid, links);
                });
                
                next(null, candidates);
            });
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
    if (user.fbid == candidate.fbid) {
        return false;
    }
    if (!candidate.settings.searchMales && user.gender == 'male') {
        //console.log('No satisface busqueda hombres.');
        return false;
    }
    if (!candidate.settings.searchFemales && user.gender == 'female') {
        //console.log('No satisface busqueda mujeres.');
        return false;
    }
    if (candidate.settings.onlyFriends && !user.settings.onlyFriends) {
        //console.log('No satisface busqueda solo amigos.');
        return false;
    }

    //User age is in the candidate age range
    var now = new Date();
    var now_str = now.getFullYear() + '/'
                + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '/'
                + (now.getDate() < 10 ? '0' : '') + now.getDate();

    if (user.birthday > getDateFromAge(now_str, candidate.settings.minAge)) {
        //console.log('No esta en el rango de edad Min.');
        return false;
    }
    
    if (user.birthday < getDateFromAge(now_str, candidate.settings.maxAge)) {
        //console.log('No esta en el rango de edad Max.');
        return false;
    }
    return true;
};

function isCloseEnough(distance, loc1, loc2) {
    var gp1 = new GeoPoint(loc1.latitude, loc1.longitude, false);   // in radian
    var gp2 = new GeoPoint(loc2.latitude, loc2.longitude, false);   // in radian
    var retVal = (gp1.distanceTo(gp2, true) <= distance);   // in kilometers
    //console.log('Esta en el rango de distancia solicitado: '+ retVal);
    return retVal;
};

function getDateFromAge(birthdate, age) {
    //birthdate: yyyy/mm/dd
    var day = birthdate.substring(8);
    var month = birthdate.substring(5, 7);
    var year = birthdate.substring(0, 4);
    return (new Date().getFullYear() - age) + '/' + month + '/' + day;
};

function isRejected(fbidCandidate, rejections) {
    for (var r of rejections) {
        if (r.fbidCandidate == fbidCandidate) {
            return true;
        }
    }
    return false;
};

function isBlocked(fbidCandidate, blocks) {
    for (var b of blocks) {
        if (b.idBlockedUser == fbidCandidate) {
            return true;
        }
    }
    return false;
};

function didReject(fbidCandidate, rejections) {
    for (var r of rejections) {
        if (r.fbidUser == fbidCandidate) {
            return true;
        }
    }
    return false;
};

function didBlock(fbidCandidate, blocks) {
    for (var b of blocks) {
        if (b.idBlockerUser == fbidCandidate) {
            return true;
        }
    }
    return false;
};

function isLinked(fbidCandidate, links) {
    if(links!=null){
        for (var l of links.acceptedUsers) {
            if (l.fbidCandidate == fbidCandidate) {
                return true;
            }
        }
    }
    return false;
};

