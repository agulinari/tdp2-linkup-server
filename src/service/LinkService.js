var async = require('async');
var userDao = require('../dao/UserDao');
var matchDao = require('../dao/UserMatchDao');
var linkDao = require('../dao/LinkDao');
var imageDao = require('../dao/ImageDao');
var activityLogService = require('./ActivityLogService');
var recommendationService = require('./RecommendationService');
var utils = require('../utils/Utils');
var LinkError = require("../error/LinkError");
var NotFound = require("../error/NotFound");


/**
 * Get Link
 * @param {String} fbidUser
 * @param {String} fbidCandidate
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserCandidateLink = function (fbidUser, fbidCandidate, callback) {
    linkDao.findLink(fbidUser, fbidCandidate,callback, function (err, link) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'link': link,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
        return;
    });
};

/**
 * Get User Links
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserLinks = function (fbidUser, callback) {
    linkDao.findUserLinks(fbidUser,callback, function (err, links) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            links,
            metadata : utils.getMetadata((links!=null)?links.length:0)
        }
        callback(null, response);
        return;
    });
};

/**
 * Get Links
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getLinks = function (callback) {
    linkDao.findLinks(callback,function (err, links) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            links,
            metadata : utils.getMetadata((links!=null)?links.length:0)
        }
        callback(null, response);
        return;
    });
};

/**
 * Save Link
 * @param {Request} Request
 * @param {Function} callback  The function to call when store is complete.
 */
exports.saveLink = function (fbidUser, fbidCandidate, callback) {
    var user = {};
    var candidate = {};
    var link = {};
    async.waterfall([
        function getUser(next) {
            userDao.findUser(fbidUser, next);
        },
        function getCandidate(response, next) {
            user = response;
            if (user == null) {
		        next(new NotFound("No se encontro el usuario"), null);
                return;
            }
            userDao.findUser(fbidCandidate, next);
        },
        function storeLink(response, next) {
            candidate = response;
            if (candidate == null) {
		        next(new NotFound("No se encontro el candidato"), null);
                return;
            }
            linkDao.saveLink(fbidUser, fbidCandidate, next);
        },
        function testMatch(response, next) {
            link = response;
            console.log('TODO: test match conditions');
            next(null, link);
        }
    ],
    function (err, link) {
        if (err) {
            callback(err);
            return;
        }
        console.log(JSON.stringify(link));
        var response = {
            'link': link,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Delete Link
 * @param {String} fbidUser
 * @param {String} fbidCandidate
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteLink = function (fbidUser, fbidCandidate, callback) {
    linkDao.deleteLink(fbidUser, fbidCandidate,callback, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
        return;
    });
};

/**
 * Delete all user's Links
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteUserLinks = function (fbidUser, callback) {
    linkDao.deleteUserLinks(fbidUser,callback, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
        return;
    });
};

/**
 * Delete all Links
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteLinks = function (callback) {
    linkDao.deleteLinks(callback,function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
        return;
    });
};

exports.getLinksUsersByCandidate = function(idsUsers,idCandidate, callback){

    linkDao.getUserLinkByIdsUsersAndIdCandidate(idsUsers,idCandidate, callback,function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
        return;
    });

}


/**
* Servicio para linkear con un candidato. Si el candidato linkeo tambien, se inicia el match y devuelve match true,
caso contrario solo linkea devolviendo match false.
*/
exports.linkCandidate = function (idUser,idCandidate,tipoDeLink, callback) {

    if (idUser!=null && idCandidate!=null) { //Valido si existen los usuarios para hacer el link
        //Los usuarios existen, ahora debo validar si:
        //      1. El usuario que hace el link no debe tener al candidato en la lista de rechazados (rejects).
        //      2. El usuario que hace el link no debe tener al candidato en la lista de matcheados (matches).
        //Obs: Como todavia la lista de rechazados y de matcheados no esta disponible, suponemos que no se dan ambos casos.

        //Busco si el usuario que hace link esta en la lista de aceptados (usersLink) del candidato.
        //El candidate es el idUser y el user es el idCandidate.

        var response = null;
        var userLinkCandidate = null;
        var itemMatchCandidate = null;
        var itemMatchUser = null;
        var user = {};


        //Si el usuario fue aceptado, guardo en la lista de aceptados el candidato aceptado el usuario
        //e inicio el match.Para este caso armo el response con el match true.
        async.waterfall([
            // Get User
            function (next) {
                userDao.findUser(idUser, (err, user) => {
                    if (err) {
                        next(err);
                        return;
                    }
                    if (user == null) {
                        next(new NotFound("No se encontro el usuario"));
                        return;
                    }
                    if (! user.control.isActive) {
                        next(new DisabledAccountError());
                        return;
                    }
                    
                    if (! user.control.isPremium
                            && user.control.availableSuperlinks == 0
                            && tipoDeLink == "Superlink") {
                        next(new LinkError('El usuario no tiene superlinks disponibles'));
                        return;
                    }
                    
                    next(null, user);
                });
            },
            // Log activity
            function (response, next) {
                user = response.toObject();
                var activityLog = {
                    idUser: user.fbid,
                    isPremium: user.control.isPremium,
                    activityType: 1
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
            function guardarActualizarLink(value, next) {
                console.log("Usuario candidato para link con user OP2: "+userLinkCandidate);
                console.log("Haciendo Link usuario con candidato.... OP2");
                linkDao.saveOrUpdateUserLink(idUser,idCandidate,tipoDeLink,next);
            },
            
            // Delete blocked user from the blocker user's recommendations
            function (value, next) {
                recommendationService.deleteUserRecommendationsToUser(idUser,
                                                                      idCandidate,
                                                                      next);
            },
                        
            // Decrement Superlink count if not premium
            function (value, next) {
                if (user.control.isPremium || tipoDeLink != "Superlink") {
                    next(null, user);
                    return;
                }
                userDao.decrementSuperlinkCounter(user, (err, data) => {
                    if (err) {
                        next(err);
                    }
                    user.control.availableSuperlinks = user.control.availableSuperlinks - 1;
                    next(null, user);
                });
            },
            
            function obtenerLinkUsuarioCandidato(value, next){
                console.log("Buscando usuarioLinkCandidate.... OP1");
                linkDao.getUserLinkByIdUserAndIdCandidate(idCandidate,idUser,next);
            },
            function obtenerCandidato(value,next){
                userLinkCandidate = value;
                console.log("Usuario candidato OP3: "+userLinkCandidate);
                if(userLinkCandidate!=null){
                    console.log("Buscando candidato.... OP3");
                    console.log("userLinkCandidate"+userLinkCandidate);
                    userDao.findUser(idCandidate,next);
                }else{
                    console.log("op3");
                    next(null,"op3");
                }
            },
            function findImageCandidateUser(value,next){
                 if(userLinkCandidate!=null){
                        console.log("Buscando imagen candidato.... OP4");
                        console.log("UserProfile candidato: "+value);
                        if(value!=null && value!=undefined){
                                console.log("Armando item candidate...OP4");
                                itemMatchCandidate = {"fbid": idCandidate,"gender": value.gender,"name":value.firstName,
                                                        "lastName":value.lastName,"age":value.birthday,"photo":"",
                                                        "time": Date.now()};
                                imageDao.findImage(idCandidate,value.avatar.image.idImage,next);
                                
                        }else{
                            next(null,"op4");
                        }
                  }else{
                      console.log("op4");
                      next(null,"op4");
                  }
            },function saveMatchCandidate(value,next){
                if(userLinkCandidate!=null && itemMatchCandidate!=null){
                        console.log("Guardando match user-candidate..OP5");
                        itemMatchCandidate.photo = value.data;
                        matchDao.saveOrUpdateUserMatch(idUser,idCandidate,itemMatchCandidate,next);
                }else{
                     console.log("op5");
                     next(null,"op5");
                }    
            },
            function obtenerUsuario(value,next){
                if(userLinkCandidate!=null){
                    console.log("Obteniendo usuario...OP6");
                    userDao.findUser(idUser,next);
                 }else{
                     console.log("op6");
                     next(null,"op6");
                 }
                
            },
            function findImageUser(value,next){
                console.log("Buscando imagen usuario.. OP7");
                if(userLinkCandidate!=null){
                        if(value!=null && value!=undefined){
                            console.log("Armando item usuario... OP7");
                            itemMatchUser = {"fbid": idUser,"gender": value.gender,"name":value.firstName,
                                                        "lastName":value.lastName,"age":value.birthday,"photo":"",
                                                        "time": Date.now()};
                            imageDao.findImage(idUser,value.avatar.image.idImage,next);
                            
                        }else{
                            next(null,"op7");
                        }
                }else{
                    console.log("op7");
                    next(null,"op7");
                }
            },
            function saveMatchUser(value,next){
                if(userLinkCandidate!=null && itemMatchUser != null){
                            console.log("Guardando match candidate-user...OP8");
                            itemMatchUser.photo = value.data;
                            matchDao.saveOrUpdateUserMatch(idCandidate,idUser,itemMatchUser,next);
                }else{
                    console.log("op8");
                    next(null,"op8");
                }
               
            }
            ],function (err, matches) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    console.log(JSON.stringify(matches));
                    response = (userLinkCandidate!=null)?{'availableSuperlinks': user.control.availableSuperlinks, 'match':true,metadata : utils.getMetadata(1)}:
                                                        {'availableSuperlinks': user.control.availableSuperlinks, 'match':false,metadata : utils.getMetadata(1)};
                    callback(null, response);
                    console.log("fin");
                    return;
              });

    }
};

