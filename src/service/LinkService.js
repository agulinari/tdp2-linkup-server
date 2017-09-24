var async = require('async');
var userDao = require('../dao/UserDao');
var matchDao = require('../dao/UserMatchDao');
var linkDao = require('../dao/LinkDao');
var userProfileDao = require('../dao/UserProfileDao');
var userProfile = require('../model/UserProfile'); 

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

/**
* Servicio para linkear con un candidato. Si el candidato linkeo tambien, se inicia el match y devuelve match true,
caso contrario solo linkea devolviendo match false.
*/
exports.linkCandidate = function (idUser,idCandidate,tipoDeLink, callback) {


    if(idUser!=null && idCandidate!=null){ //Valido si existen los usuarios para hacer el link
        //Los usuarios existen, ahora debo validar si:
        //      1. El usuario que hace el link no debe tener al candidato en la lista de rechazados (rejects).
        //      2. El usuario que hace el link no debe tener al candidato en la lista de matcheados (matches).
        //Obs: Como todavia la lista de rechazados y de matcheados no esta disponible, suponemos que no se dan ambos casos.

        //Busco si el usuario que hace link esta en la lista de aceptados (usersLink) del candidato.
        //El candidate es el idUser y el user es el idCandidate.

            var response = null;
            var userLinkCandidate = null;


            //Si el usuario fue aceptado, guardo en la lista de aceptados el candidato aceptado el usuario
            //e inicio el match.Para este caso armo el response con el match true.

                async.waterfall([
                    function obtenerLinkUsuarioCandidato(callback){
                        linkDao.getUserLinkByIdUserAndIdCandidate(idCandidate,idUser,callback);
                    },
                    function guardarActualizarLink(value,callback){
                        userLinkCandidate = value;
                        linkDao.saveOrUpdateUserLink(idUser,idCandidate,tipoDeLink,callback);
                    },
                    function obtenerCandidato(value,callback){
                        if(userLinkCandidate!=null){
                            console.log("userLinkCandidate"+userLinkCandidate);
                            userDao.findUser(idCandidate,callback);
                        }else{
                            console.log("op1");
                            callback(null,"op1");
                        }
                    },
                    function saveMatchCandidateUser(value,callback){
                         if(userLinkCandidate!=null){
                                console.log("UserProfile candidato: "+value);
                                if(value!=null && value!=undefined){
                                        var itemMatchCandidate = {"fbidUser": idCandidate,"gender": value.gender,"name":value.firstName,
                                                                "lastName":value.lastName,"age":value.birthday,"idShortImage":value.avatar.image.idImage,
                                                                "time": Date.now()};
                                        matchDao.saveOrUpdateUserMatch(idUser,idCandidate,itemMatchCandidate,callback);
                                }else{
                                    callback(null,"op2");
                                }
                          }else{
                              console.log("op2");
                              callback(null,"op2");
                          }
                    },
                    function obtenerUsuario(value,callback){
                        if(userLinkCandidate!=null){
                            userDao.findUser(idUser,callback);
                         }else{
                             callback(null,"op3");
                         }
                        
                    },
                    function saveMatchUserCandidate(value,callback){
                                console.log("UserProfile usuario: "+value);
                        if(userLinkCandidate!=null){
                                if(value!=null && value!=undefined){
                                var itemMatchCandidate = {"fbidUser": idUser,"gender": value.gender,"name":value.firstName,
                                                          "lastName":value.lastName,"age":value.birthday,"time": Date.now()};
                                    matchDao.saveOrUpdateUserMatch(idCandidate,idUser,itemMatchCandidate,callback);
                                }else{
                                    callback(null,"op4");
                                }
                        }else{
                            console.log("op4");
                            callback(null,"op4");
                        }
                    }],function (err, matches) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            console.log(JSON.stringify(matches));
                            response = (userLinkCandidate!=null)?{'remainingSuperlinks': 0, 'match':true,metadata : utils.getMetadata(1)}:
                                                                {'remainingSuperlinks': 0, 'match':false,metadata : utils.getMetadata(1)};
                            callback(null, response);
                            console.log("fin");
                            return;
                      });

    }
  };

