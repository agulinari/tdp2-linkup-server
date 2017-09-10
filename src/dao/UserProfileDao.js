'use strict';

var userProfile = require('../model/UserProfile');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves an List of Subjects
 * @param {Array} list of subject ids.
 * @param {Function} callback  The function to call when retrieval is complete.
 **/
exports.getUserProfileById = function(id, callback) {
    userProfile.findOne({"fbid":id},function (err, value) {
        if (err){
            console.log('Error: ' + err);
            callback(err,null);
        }
	    if(value == null || value.length == 0){
		    console.log('No se encontro el usuario con id: ' + id);
	            err = new NotFound("No se encontro el usuario");
		    callback(err, null);
	    }else if(value != null){
		    console.log('Retrieving UserProfile with id: ' + id);
	            callback(null, value);
            }
    });
};

exports.getUsersProfile = function(term,offset,count,callback) {
      console.log("offset " + offset);
      console.log("count " + count);
      userProfile.find({},function (err, values) {
      if (err){
           console.log('Error: ' + err);
	   callback(err,null);
      }
	callback(null, values);
    }).sort('name').skip(offset).limit(count);    
};

exports.saveUserProfile = function (userProfileIn, callback) {
            
      var userProfileData = new userProfile(userProfileIn);
       
       if((userProfileData != null && userProfileData != undefined) && 
         (userProfileIn.fbid != null && userProfileIn.fbid!= undefined)){	

      		console.log("userProfile fbid a insertar: " + userProfileData.fbid);

      		userProfile.find({"fbid":userProfileData.fbid},function(err,values){

			if(err){
				console.log('Error: Buscando usuario a insertar: '+ err);
				callback(err,null);	
			}	

			if(values == null || values.length == 0){
	      
		    	      userProfileData.save(function (err) {

		    		 if(err) {
        	   		    console.error('Error haciendo save del perfil de usuario!');
		    		    callback(err,'Error save perfil de usuario');
        	 		 }
	    
	        	         callback(null,userProfileData);
      	     	    	      });
			}else if(values!=null){
			      err = new BadRequest("UserProfile already exist");
			      callback(err,null);
		        }
      		});
       }else{
       	   err = BadRequest("No se pudo procesar el request");
	   callback(err,null);
       }
	
};

exports.updateUserProfile = function (userProfileIn, callback) {

      var userProfileData = new userProfile(userProfileIn);
      
      if((userProfileData != null && userProfileData != undefined) && 
         (userProfileIn.fbid != null && userProfileIn.fbid!= undefined)){
      	   
           var id = userProfileData.fbid;
      	   console.log("userProfile fbid a updatear: " + id);

      	   userProfile.find({"fbid":id},function(err,values){
 
         	if(values != null && values.length != 0){ 
      			userProfile.update({"fbid":id},function(err){
				if(err){
					console.log(err);			
					callback(err,'Error update user profile');
				}
				console.log('Updating usersProfile');
				callback(null,userProfileData);	
			});
	
	 	}else if(values!=null){			
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


exports.deleteUsersProfile = function (callback) {

      	   userProfile.remove({},function(err,values){
 
         	if(err){
			console.log(err);
			callback(err,null);			
		}
		
		console.log("borrando users profile");
		callback(null);	
	   });
};
