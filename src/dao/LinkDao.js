'use strict';

var Link = require('../model/Link');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves user's Links
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findUserLinks = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    var proj = "-_id -fbidUser -acceptedUsers.time -acceptedUsers._id -__v";
    Link.findOne(query, proj, function (err, value) {
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
    var proj = "-_id -acceptedUsers.time -acceptedUsers._id -__v";
    Link.find(null, proj, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
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
        return;
    });
};

/**
 * Deletes all user's Links
 * @param {String} fbidUser User facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteUserLinks = function(fbidUser, callback) {

    var conditions = {
            "fbidUser":fbidUser
    };
    var update = {
            $set: { "acceptedUsers": []}
    };

    Link.findOneAndUpdate(conditions,update, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
        return;
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
        return;
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

    Link.findOne(conditions, function(err, value) {

        var retValue = value;

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
        console.log("Ingreso a linkeo:"+retValue);
        callback(null, retValue);
        return;

    });
};

exports.saveOrUpdateUserLink = function (idUser,idCandidate,tipoLinkParam, callback) {

    if(idUser!=null && idCandidate!=null){
        console.log('INGRESO A GUARDAR');
        var tipoLink = (tipoLinkParam!=null && tipoLinkParam!=undefined)?tipoLinkParam : "Link";
        var itemAcceptedUser = {"fbidCandidate": idCandidate,"typeOfLink": tipoLink,"countOfSuperLinks": 0, "time": Date.now()};

        var conditions = {
            "fbidUser":idUser,
            "acceptedUsers.fbidCandidate" : {$ne: idCandidate}
        };
        var update = {
            $addToSet: { "acceptedUsers": itemAcceptedUser}
        };

        Link.findOne({"fbidUser":idUser}, function(err,data){

            if (err) {
                callback(err,null);
                return;
            }

            if(data==null){
                console.log('GUARDA');
                var userLink = new Link();
                userLink.fbidUser = idUser;
                userLink.acceptedUsers = [itemAcceptedUser];
                userLink.save();
                callback(null, data);
                return;
            }else{
                Link.update(conditions, update, function(err, doc) {
                    if(err){
                        console.log(err);
                        callback(err,null);
                        return;
                    }


                    console.log("ESTA ACTUALIZANDO");
                    callback(null, doc);
                    return;
                });
            }


        });
    }else{
        err = BadRequest("No se pudo procesar el request");
        callback(err,null);
        return;
    }
};

