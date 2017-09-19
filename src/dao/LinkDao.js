'use strict';

var Link = require('../model/Link');
var UserLink = require('../model/UserLink');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves a Link
 * @param {String} fbidUser User facebook ID.
 * @param {String} fbidCandidate Candidate facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findLink = function(fbidUser, fbidCandidate, callback) {
    var query = {
        "fbidUser": fbidUser,
        "fbidCandidate": fbidCandidate
    };
    var proj = "fbidUser fbidCandidate time -_id";
    Link.findOne(query, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves user's Links
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findUserLinks = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    var proj = "fbidUser fbidCandidate time -_id";
    Link.find(query, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves Links
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findLinks = function(callback) {
    var proj = "fbidUser fbidCandidate time -_id";
    Link.find(null, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

exports.saveLink = function(fbidUser, fbidCandidate, callback) {
    var newLink = new Link();
    newLink.fbidUser = fbidUser;
    newLink.fbidCandidate = fbidCandidate;
    exports.findLink(fbidUser, fbidCandidate, function (err, link) {
        if (err) {
            callback(err, null);
            return;
        }
        if (link != null) {
            var msg = "User " + fbidUser + ' already linked ' + fbidCandidate;
            callback(new LinkError(msg), null);
            return;
        }
        newLink.save(function(err, value) {
            if (err) {
                callback(err,null);
                return;
            }
            callback(null, value);
        });
    });
};

/**
 * Deletes a Link
 * @param {String} fbidUser User facebook ID.
 * @param {String} fbidCandidate Candidate facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteLink = function(fbidUser, fbidCandidate, callback) {
    var query = {
        "fbidUser": fbidUser,
        "fbidCandidate": fbidCandidate
    };
    Link.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all user's Links
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteUserLinks = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    Link.deleteMany(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all Links
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteLinks = function(callback) {
    Link.deleteMany(function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Devuelve el candidate si lo encuentra en el array de candidatos del usuario.
 * En caso de no encontrar el usuario o el candidato, retorna null;
 * @param id fbidCandidate.
 * @param {Function} callback  The function to call when retrieval is complete.
 **/
exports.getUserLinkByIdUserAndIdCandidate = function(idUser,idCandidate, callback) {

    var conditions = {
        "fbidUser":idUser,
        "acceptedUsers.fbidCandidate" : {$eq: idCandidate}
    };

    UserLink.findOne(conditions, function(err, value) {

        var retValue = null;

        if (err) {
            callback(err,null);
            return;
        }

        if(value!=null && value.acceptedUsers!=null){
            var listCandidates = value.acceptedUsers;
            console.log('Lista de candidatos: ' + listCandidates);
            console.log('Cantidad de candidatos: ' + listCandidates.length);

            for(var i = 0; i < listCandidates.length; i++) {
                console.log('Id Candidato iterando: ' + listCandidates[i].fbidCandidate);
                if(listCandidates[i].fbidCandidate == idCandidate){
                    retValue = listCandidates[i];
                    break;
                }
            }
        }

        console.log('Retrieving UserLink with id: ' + idCandidate);
        callback(null, retValue);

    });
};

exports.saveOrUpdateUserLink = function (idUser,idCandidate, callback) {

    if(idUser!=null && idCandidate!=null){

        var itemAcceptedUser = {"fbidCandidate": idCandidate,"typeOfLink": "Link","countOfSuperLinks": 0, "time": Date.now()};

        var conditions = {
            "fbidUser":idUser,
            "acceptedUsers.fbidCandidate" : {$ne: idCandidate}
        };
        var update = {
            $addToSet: { "acceptedUsers": itemAcceptedUser}
        };

        UserLink.findOne({"fbidUser":idUser}, function(err,data){

            if(data==null){
                console.log('GUARDA');
                var userLink = new UserLink();
                userLink.fbidUser = idUser;
                userLink.acceptedUsers = [itemAcceptedUser];
                userLink.save();
            }else{
                UserLink.update(conditions, update, function(err, doc) {
                    if(err){
                        console.log(err);
                        return;
                    }
                // doSave = false;

                    console.log("ESTA ACTUALIZANDO");
                    return;
                });
            }
            return;
        });
    }else{
        err = BadRequest("No se pudo procesar el request");
        callback(err,null);
    }
};

