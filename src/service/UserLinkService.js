var async = require('async');
var utils = require('../utils/Utils');
var userLinkDao = require('../dao/UserLinkDao');
var userMatchDao = require('../dao/UserMatchDao');
var UserLink = require('../model/UserLink');
var userProfileDao = require('../dao/UserProfileDao');
var NotFound = require("../error/NotFound");

exports.linkCandidate = function (idUser,idCandidate, callback) {


    if(idUser!=null && idCandidate!=null){ //Valido si existen los usuarios para hacer el link

        //Los usuarios existen, ahora debo validar si:
        //      1. El usuario que hace el link no debe tener al candidato en la lista de rechazados (rejects).
        //      2. El usuario que hace el link no debe tener al candidato en la lista de matcheados (matches).
        //Obs: Como todavia la lista de rechazados y de matcheados no esta disponible, suponemos que no se dan ambos casos.

        //Busco si el usuario que hace link esta en la lista de aceptados (usersLink) del candidato.
        //El candidate es el idUser y el user es el idCandidate.
        userLinkDao.getUserLinkByIdUserAndIdCandidate(idCandidate,idUser, function(err, userLinkCandidate){

            if(err){
                callback(err, response);
                return;
            }

            var response = null;

            userLinkDao.saveOrUpdateUserLink(idUser,idCandidate);
            //Si el usuario fue aceptado, guardo en la lista de aceptados el candidato aceptado el usuario
            //e inicio el match.Para este caso armo el response con el match true.
            if(userLinkCandidate!=null){

                userMatchDao.saveOrUpdateUserMatch(idUser,idCandidate);
                userMatchDao.saveOrUpdateUserMatch(idCandidate,idUser);
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
