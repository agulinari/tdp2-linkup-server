var async = require('async');
var userDao = require('../dao/UserProfileDao');
var matchDao = require('../dao/UserMatchDao');
var linkDao = require('../dao/LinkDao');
var userProfileDao = require('../dao/UserProfileDao');
var userProfile = require('../model/UserProfile'); 
var UserLink = require('../model/UserLink'); //Esta tiene un array de users
var userMatchDao = require('../dao/UserMatchDao');
var utils = require('../utils/Utils');
var LinkError = require("../error/LinkError");
var NotFound = require("../error/NotFound");

var async = require('async');
var utils = require('../utils/Utils');


/**
 * Get Link
 * @param {String} fbidUser
 * @param {String} fbidCandidate
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserCandidateLink = function (fbidUser, fbidCandidate, callback) {
    linkDao.findLink(fbidUser, fbidCandidate, function (err, link) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'link': link,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Get User Links
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getUserLinks = function (fbidUser, callback) {
    linkDao.findUserLinks(fbidUser, function (err, links) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'links': links,
            metadata : utils.getMetadata(links.length)
        }
        callback(null, response);
    });
};

/**
 * Get Links
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.getLinks = function (callback) {
    linkDao.findLink(function (err, links) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'links': links,
            metadata : utils.getMetadata(links.length)
        }
        callback(null, response);
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
            userDao.getUserProfileById(fbidUser, next);
        },
        function getCandidate(response, next) {
            user = response;
            if (user == null) {
		        next(new NotFound("No se encontro el usuario"), null);
                return;
            }
            userDao.getUserProfileById(fbidCandidate, next);
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
    linkDao.deleteLink(fbidUser, fbidCandidate, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Delete all user's Links
 * @param {String} fbidUser
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteUserLinks = function (fbidUser, callback) {
    linkDao.deleteUserLinks(fbidUser, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
    });
};

/**
 * Delete all Links
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteLinks = function (callback) {
    linkDao.deleteLinks(function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        callback(null, response);
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
        linkDao.getUserLinkByIdUserAndIdCandidate(idCandidate,idUser, function(err, userLinkCandidate){

            if(err){
                callback(err, userLinkCandidate);
                return;
            }

            var response = null;

            linkDao.saveOrUpdateUserLink(idUser,idCandidate,tipoDeLink);
            //Si el usuario fue aceptado, guardo en la lista de aceptados el candidato aceptado el usuario
            //e inicio el match.Para este caso armo el response con el match true.
            if(userLinkCandidate!=null){
                
                userProfileDao.getUserProfileById(idCandidate,function(err, value){
                    if(err){
                        callback(err, value);
                        return;
                    }
                    console.log("UserProfile usuario: "+value);
                    if(value!=null && value!=undefined){
                        var itemMatchCandidate = {"fbidUser": idCandidate,"genero": value.gender,"nombre":value.firstName,
                                                  "apellido":value.lastName,"edad":value.birthday,"time": Date.now()};
                        userMatchDao.saveOrUpdateUserMatch(idUser,idCandidate,itemMatchCandidate);
                    }
                });
                
                userProfileDao.getUserProfileById(idUser,function(err,value){
                    if(err){
                        callback(err, value);
                        return;
                    }
                    console.log("UserProfile candidato: "+value);
                    if(value!=null && value!=undefined){
                        var itemMatchCandidate = {"fbidUser": idUser,"genero": value.gender,"nombre":value.firstName,
                                                  "apellido":value.lastName,"edad":value.birthday,"time": Date.now()};
                        userMatchDao.saveOrUpdateUserMatch(idCandidate,idUser,itemMatchCandidate);
                    }
                        
                });
                            
                console.log('Encontrado');
                response = {'remainingSuperlinks': 0, 'Match':true,metadata : utils.getMetadata(1)};
            }else{ //No fue aceptado. Armo el response con el match false. Aca me fijo si hizo superlink y descuento la cantidad.
                response = {'remainingSuperlinks': 0, 'Match':false,metadata : utils.getMetadata(1)};
                console.log('No encontrado');
            }

            callback(null, response);

        });

    }else{
        console.log('No encontro el usuario');
        callback(new NotFound("No se encontro el usuario"), null);
        return;
    }
};

