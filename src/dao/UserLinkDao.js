'use strict';

var UserLink = require('../model/UserLink');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves an Entity of UserLink
 * @param id fbid.
 * @param {Function} callback  The function to call when retrieval is complete.
 **/
exports.getUserLinkById = function(id, callback) {
    UserLink.findOne({"fbidUser":id}, function(err, value) {
        if (err) {
            callback(err,null);
            return;
        }

		console.log('Retrieving UserLink with id: ' + id);
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
    UserLink.findOne({"fbidUser":idCandidate}, function(err, value) {

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
                 if(listCandidates[i].fbidCandidate == idUser){
                     retValue = listCandidates[i];
                     break;
                 }
             }
        }

		console.log('Retrieving UserLink with id: ' + idCandidate);
        callback(null, retValue);

    });
};

exports.saveOrUpdateUserLink = function (userLink, callback) {

        if(userLink!=null){
          var id = userLink.fbidUser;
          var idCandidate = userLink.acceptedUsers[0].fbidCandidate;

          UserLink.findOneAndUpdate({"fbidUser":id, "acceptedUsers.fbidCandidate": {$ne: idCandidate}}, {$addToSet: { "acceptedUsers": userLink.acceptedUsers }}, { "new": true},function(err, doc) {
            if(err){
                callback(err,null);
                return;
            }
            console.log("DOC actualizado: " + doc);
            /*callback(null,doc); */
            return;
          });


           /*UserLink.findOne({"fbidUser":id},function(err,doc){
				if(err){
					console.log(err);
					callback(err,'Error update userLink');
				}

                if(doc == null){//Debo hacer el save
                    userLinkData.save();
                }else{ //Debo actualizar, dado que ya existe
                    console.log('Updating userLink');

                    for(i=0; i< doc.array.length; i++) {
                        doc.array[i].property = 'new value';
                    }

                }
				callback(null,userProfileData);
            });*/

      }else{
           err = BadRequest("No se pudo procesar el request");
	       callback(err,null);
      }
};





