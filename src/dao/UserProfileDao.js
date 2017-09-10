'use strict';

var UserProfile = require('../model/UserProfile');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves an List of Subjects
 * @param {Array} list of subject ids.
 * @param {Function} callback  The function to call when retrieval is complete.
 **/
exports.getUserProfileById = function(id, callback) {
    console.log('Retrieving UserProfile with id: ' + id);
    UserProfile.find({"fbid":id},function (err, value) {
        if (err){
            console.log('Error: ' + err);
            callback(err,null);
        }
	    if(value.length == 0){
	            err = new NotFound("No se encontro el usuario");
		    callback(err, null);
	    }else{
	            callback(null, value);
            }
    });
};

exports.getUsersProfile = function(term,offset,count,callback) {
      console.log("offset " + offset);
      console.log("count " + count);
      UserProfile.find({},function (err, values) {
      if (err){
           console.log('Error: ' + err);
	   callback(err,null);
      }
	callback(null, values);
    }).sort('name').skip(offset).limit(count);    
};

exports.saveUserProfile = function (userProfile, callback) {
            
      var userProfileData = new UserProfile(userProfile);
       
       if((userProfileData != null && userProfileData != undefined) && 
         (userProfile.fbid != null && userProfile.fbid!= undefined)){	

      		console.log("userProfile fbid a insertar: " + userProfileData.fbid);

      		UserProfile.find({"fbid":userProfileData.fbid},function(err,values){

			if(err){
				console.log('Error: Buscando usuario a insertar: '+ err);
				callback(err,null);	
			}	

			if(values.length == 0){
	      
		    	      userProfileData.save(function (err) {

		    		 if(err) {
        	   		    console.error('Error haciendo save del perfil de usuario!');
		    		    callback(err,'Error save perfil de usuario');
        	 		 }
	    
	        	         callback(null,userProfile);
      	     	    	      });
			}else{
			      err = new BadRequest("UserProfile already exist");
			      callback(err,null);
		        }
      		});
       }else{
       	   err = BadRequest("No se pudo procesar el request");
	   callback(err,null);
       }
	
};

exports.updateUserProfile = function (userProfile, callback) {

      var userProfileData = new UserProfile(userProfile);
      
      if((userProfileData != null && userProfileData != undefined) && 
         (userProfile.fbid != null && userProfile.fbid!= undefined)){
      	   
           var id = userProfile.fbid;
      	   console.log("userProfile fbid a updatear: " + id);

      	   UserProfile.find({"fbid":id},function(err,values){
 
         	if(values.length != 0){ 
      			UserProfile.update({"fbid":id},userProfile,function(err,numberAffected){
				if(err){
					console.log(err);			
					callback(err,'Error update user profile');
				}
				console.log('Update %d usersProfile', numberAffected);
				callback(null,userProfile);	
			});
	
	 	}else{			
			console.log('No se encontro el perfil del usuario con id ', id);
			err = new NotFound("UserProfile not exist");
		        callback(err,null);	
		}
     	   });
      }else{
           err = BadRequest("No se pudo procesar el request");
	   callback(err,null);
      }
};
