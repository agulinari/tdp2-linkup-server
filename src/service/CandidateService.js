var async = require('async');
var config = require('../config/Config');
var utils = require('../utils/Utils');
var userDao = require('../dao/UserDao');
var User = require('../model/User');
var rejectionDao = require('../dao/RejectionDao');
var activityLogService = require('./ActivityLogService');
var blockService = require('./BlockService');
var recommendationService = require('./RecommendationService');
var linkDao = require('../dao/LinkDao');
var GeoPoint = require('geopoint');
var NotFound = require("../error/NotFound");
var DisabledAccountError = require("../error/DisabledAccountError");
var adService = require("./AdService");

exports.getCandidates = function (id, callback) {
    var user = {};

    async.waterfall([
        // Get User
        function (next) {
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
        // Log activity
        function (response, next) {
            user = response;
            var activityLog = {
                idUser: user.fbid,
                isPremium: user.control.isPremium,
                activityType: 0
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
        // Find candidates by user's criteria
        function (response, next) {
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
        // Filter candidates when user don't match candidate's criteria
        function (response, next) {
            var users = response;
            var candidates = [];
            users.forEach(function (candidate) {
                if (canBeCandidate(user, candidate)) {
                    candidates.push(candidate);
                }
            });

            next(null, candidates);
        },
        // Filter rejected candidates
        function (candidates, next) {
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
        // Filter candidates that rejected the user
        function (candidates, next) {
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
        // Filter blocked candidates
        function (candidates, next) {
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
        // Filter candidates that blocked the user
        function (candidates, next) {
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
        // Filter linked candidates
        function (candidates, next) {
            if (candidates.length == 0) {

                next(null, candidates);
                return;
            }
            console.log("Busca Links");
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
        // Filter matched candidates
        function (candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            console.log('TODO: filtrar candidatos matcheados');
            next(null, candidates);
        },
        
        // Sort candidates by recommendations
        function (candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            recommendationService.getRecommendedUsersToUser(user.fbid,
                                                            (err, idUsers) => {
                if (err) {
                    next(err, null);
                    return;
                }
                var indexToDelete = [];
                var recommendedCandidates = [];
                
                for (var i = 0, len = candidates.length; i < len; i++) {
                    if (isRecommended(candidates[i].fbid, idUsers)) {
                        recommendedCandidates.push(candidates[i]);
                        indexToDelete.push(i); 
                    }
                }
                
                for(var j = 0, len = indexToDelete.length; j < len; j++){ 
                    candidates.splice(indexToDelete[j],1);
                    candidates.unshift(recommendedCandidates[j]);
                }
                next(null, candidates);   
            });
        },
                
        // Sort candidates by SuperLink priority
        function (candidates,next){
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }

            //console.log("Cantidad de candidatos superlink: "+candidates.length);
            //console.log("candidatos: "+candidates);
            var idsCandidates = [];
            for (var index = 0, len = candidates.length; index < len; index++) {
                var fbIdCandidate = candidates[index].fbid;
                idsCandidates.push(fbIdCandidate);
            }
            //console.log("Candidatos a buscar: "+idsCandidates);
            linkDao.getUserLinkByIdsUsersAndIdCandidate(idsCandidates,user.fbid,function (err, acceptedUsers){
                //linkDao.getUserLinkByIdUserAndIdCandidate(fbIdCandidate,user.fbid,function (err, valueLink){
                if (err) {
                    next(err, null);
                    return;
                }
                //console.log("valor valueLink:"+valueLink);
                var candidatesSort = getArrayCandidatesOrderByTypeOfLinkAndDate(acceptedUsers,candidates,user.fbid);
                //console.log("candidatos agregados al sort:"+candidatesSort);
                completeCandidates(candidatesSort, candidates);
                //console.log("candidatos agregados restantes:"+candidatesSort);
                next(null, candidatesSort);
            });

        },
        // Sort candidates by Account Type
        function (candidates, next){
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            
            var indexToDelete = [];
            var candidatesPremium = [];
            
            for (var index = 0, len = candidates.length; index < len; index++) {
                var isCandidatePremium = candidates[index].control.isPremium;
                console.log("Es candidato Premium: "+isCandidatePremium);
                if(isCandidatePremium){
                    candidatesPremium.push(candidates[index]);
                    indexToDelete.push(index); 
                }
            }
            
            for(var index = 0, len = indexToDelete.length; index < len; index++){ 
                candidates.splice(indexToDelete[index],1); //Elimina el candidato con cuenta premium
                candidates.unshift(candidatesPremium[index]); //Pongo el candidato con cuenta premium en la primera posicion
            }
            console.log("Fin proceso sor candidates by account type ");
            next(null, candidates);            
        },
        // Insert Ad content
        function (candidates, next) {
            if (candidates.length == 0) {
                next(null, candidates);
                return;
            }
            if (user.control.isPremium && user.settings.blockAds) {
                next(null, candidates);
                return;
            }
            adService.getAds((err, ads) => {
                if (err) {
                    next(err);
                }
                if (ads == null || ads.length == 0) {
                    next(null, candidates);
                    return;
                }
                
                var candidatesPlusAds = [];
                var ad = null;
                candidatesPlusAds.push(candidates[0]);
                for (var i = 1; i < candidates.length; ++i) {
                    if (ads.length != 0 && ((i) % config.app.adRate) == 0) {
                        ad = ads.splice(Math.floor(Math.random() * ads.length),
                                        1);
                        candidatesPlusAds.push(ad[0]);
                    }
                    candidatesPlusAds.push(candidates[i]);
                    
                }
                
                next(null, candidatesPlusAds);
            });
        }
    ],
    function (err, response) {
        if (err) {
            callback(err);
            return;
        }
        //console.log("response a devolver:"+response);
        var response = {
            'candidates': response,
            availableSuperlinks: user.control.availableSuperlinks,
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

function isRecommended(fbidCandidate, recommendedUsers) {
    for (var id of recommendedUsers) {
        if (id == fbidCandidate) {
            return true;
        }
    }
    return false;
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

function completeCandidates(candidatesSort, candidates){
    if(candidates!=null && candidatesSort!=null){
        var encontrado;
        for(var c of candidates){
            encontrado = false;
            for (var cs of candidatesSort) {
                //console.log("Id sort candidate:"+cs.fbid);
                if (cs.fbid == c.fbid) {
                    encontrado=true;
                    break;
                }
            }
            if(!encontrado){
                //console.log("Agrego:"+c.fbid);
                candidatesSort.push(c);
            }
        }
    }
}

function getCandidateForAddToArray(fbidUser,candidates){
    for (c of candidates){

        if(c.fbid == fbidUser){

            return c;
        }
    }
    return null;
}

function sortCandidatesByTypeOfLinkAndDate(candidatesSort){
    candidatesSort.sort(function(c1, c2) {
        if ((c1.typeOfLink==c2.typeOfLink && c1.time<c2.time)||
            (c1.typeOfLink!=c2.typeOfLink && c1.typeOfLink=="Link")){
            return 1;
        }
        if ((c1.typeOfLink==c2.typeOfLink && c1.time>c2.time)||
            (c1.typeOfLink!=c2.typeOfLink && c2.typeOfLink=="Link")   ) {
            return -1;
        }
        // a debe ser igual b
        return 0;
    });
}

function removeSortCandidateTypeOfLinkAndDate(candidatesSort){
    var candidatesSortAux=[];
    for (candidate of candidatesSort){
        var candidateAux = new User();

        //console.log("candidate AUX:"+candidateAux);
        candidatesSortAux.push(candidateAux);
    }
    return candidatesSortAux;
}

function getArrayCandidatesOrderByTypeOfLinkAndDate(users,candidates,fbidUser){

    //console.log("Candidate users:"+users);

    var candidatesSort=[];
    for (user of users){
        for(acceptedUser of user.acceptedUsers){
            if((acceptedUser.fbidCandidate == fbidUser)&&(acceptedUser.typeOfLink=="Superlink")){
                var candidateAdd = getCandidateForAddToArray(user.fbidUser,candidates);
                if(candidateAdd!=null){

                    candidateAdd.typeOfLink="Superlink";
                    candidateAdd.time=acceptedUser.time;

                    //console.log("Candidato a agregar:"+candidateAdd);
                    candidatesSort.unshift(candidateAdd);
                }
                //console.log("UNSHIFT");
                break;
            }else if(acceptedUser.fbidCandidate == fbidUser){
                var candidateAdd = getCandidateForAddToArray(user.fbidUser,candidates);
                if(candidateAdd!=null){

                    candidateAdd.typeOfLink="Link";
                    candidateAdd.time=acceptedUser.time;

                    //console.log("Candidato a agregar:"+candidateAdd);
                    candidatesSort.push(candidateAdd);
                }
               // console.log("PUSH");
                break;
            }
        }
    }
    sortCandidatesByTypeOfLinkAndDate(candidatesSort);
    //candidateSort=removeSortCandidateTypeOfLinkAndDate(candidatesSortAux);
    return candidatesSort;
}
