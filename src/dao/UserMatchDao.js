'use strict';

var UserMatch = require('../model/UserMatch');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

exports.findMatchs = function(fbidUser, fbidCandidate, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    
    var matches = '';
    
    UserMatch.findOne(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        console.log("Valores match: "+value);
        matches = (value!=null && value!=undefined)?value.matches:'';
        callback(null,matches);
    });
    
   
};

exports.deleteMatchs = function(callback) {

    UserMatch.deleteMany(function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
    
   
};

exports.saveOrUpdateUserMatch = function (idUser,idCandidate,itemMatchCandidate, callback) {

    if(idUser!=null && idCandidate!=null){

        var conditions = {
            "fbidUser":idUser,
            "matches.fbidUser" : {$ne: idCandidate}
        };

        var update = {
            $addToSet: { "matches": itemMatchCandidate}
        };

        UserMatch.findOne({"fbidUser":idUser}, function(err, data) {
            if(err){
                callback(err,null);
                return;
            }

            if(data==null){
                var userMatch = new UserMatch();
                userMatch.fbidUser = idUser;
                userMatch.matches = [itemMatchCandidate];
                userMatch.save();
            }else{
                UserMatch.update(conditions, update, function(err, doc) {
                    if(err){
                        console.log(err);
                        return;
                    }
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





