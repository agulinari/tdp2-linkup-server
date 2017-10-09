'use strict';

var UserMatch = require('../model/UserMatch');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

exports.findMatchs = function(fbidUser, callback) {
    var query = {
        "fbidUser": fbidUser,
    };
    
    var matches = '';
    
    UserMatch.findOne(query, function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        //console.log("Valores match: "+value);
        matches = (value!=null && value!=undefined)?value.matches:'';
        callback(null,matches);
        return;
    });
    
   
};

exports.deleteMatch = function(fbidUser, fbidCandidate, callback) {

    var query = {"fbidUser": fbidUser};

    UserMatch.update(query,{$pull:{ "matches": {"fbid": fbidCandidate} }},
                     function (err, value) {
                        if (err) {
                            callback(err,null);
                            return;
                        }
                        callback(null, value);
                        return;
                    });
};

exports.deleteMatchs = function(callback) {

    UserMatch.deleteMany(function (err, value) {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
        return;
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
                console.log("ESTA GUARDANDO");
                callback(null,data);
            }else{
                UserMatch.update(conditions, update, function(err, doc) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log("ESTA ACTUALIZANDO");
                    callback(null,doc);
                });
            }

        });

    }else{
        err = BadRequest("No se pudo procesar el request");
        callback(err,null);
        return;
    }
};





