'use strict';

var UserProfile = require('../model/UserProfile');

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
	    callback(null, value);
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

      console.log("userProfile fbid a insertar: " + userProfileData.fbId);

      UserProfile.find({"fbid":userProfileData.fbId},function(err,values){

	if(err){
		console.log('Error: Buscando usuario a insertar: '+ err);
		callback(err,'Error buscando usuario a insertar');	
	}	

	if(values.length == 0){
	      
	    userProfileData.save(function (err) {

	    	if(err) {
           		console.error('Error haciendo save del perfil de usuario!');
	    		callback(err,'Error save perfil de usuario');
            	}
	    
	        callback(null,'userProfile created');
      	     });
	}else{
		callback(null,'userProfile already exist');
	}
      });
};

exports.updateUserProfile = function (userProfile, callback) {

      var userProfileData = new UserProfile(userProfile);
      
      var id = userProfile.fbid;
      console.log("userProfile fbid a updatear: " + userProfileData.fbId);

       UserProfile.update({"fbid":id},userProfile,
		function(err,numberAffected){
			if(err){
				console.log(err);			
				callback(err,'Error update user profile');
			}
			console.log('Update %d usersProfile', numberAffected);
			callback(null,'userProfile update');	
		});

};
