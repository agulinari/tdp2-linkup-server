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
    UserProfile.findOne({"fbid":id}, function(err, value) {
        if (err) {
            callback(err,null);
            return;
        }
		console.log('Retrieving UserProfile with id: ' + id);
        callback(null, value);
        return;
    });
};

exports.getUserProfileByCriteria = function(criteria, callback) {
    var query = {
        birthday: {
            $lte: criteria.minDate,
            $gte: criteria.maxDate
        },
        "settings.onlyFriends" : criteria.onlyFriends,
        "settings.invisible" : criteria.invisible
    };
    if (!criteria.searchMales || !criteria.searchFemales) {
        query.gender = criteria.searchMales ? 'male' : 'female';
    }

    //console.log('query: ' + JSON.stringify(query));
    UserProfile.find(query, function (err, value) {
        if (err) {
            callback(err, null);
            return;
        }
	    if(value == null){
		    callback(new NotFound("find value es null"), null);
		    return;
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

       if((userProfileData != null && userProfileData != undefined) &&
         (userProfile.fbid != null && userProfile.fbid!= undefined)){

      		console.log("userProfile fbid a insertar: " + userProfileData.fbid);

      		UserProfile.find({"fbid":userProfileData.fbid},function(err,values){

			if(err){
				console.log('Error: Buscando usuario a insertar: '+ err);
				callback(err,null);
			}
                        console.log("Cantidad de usuarios: "+values.length);
			if(values == null || values.length == 0){

			     // function(err,result){

		    		//    if(err) {
        	   		  //  	console.error('Error haciendo save del perfil de usuario!');
		    		    // 	callback(err,'Error save perfil de usuario');
        	 		    //}
	    
	        	          // callback(null,userProfileData);
      	     	    	     // }

		    	      userProfileData.save();
			      callback(null,userProfileData);
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

exports.updateUserProfile = function (userProfile, callback) {

      //var userProfileData = new UserProfile(userProfile);
      var userProfileData = Object.assign({},userProfile);
      console.log(JSON.stringify(userProfileData));
      
      if((userProfileData != null && userProfileData != undefined)){// &&
         //(userProfile.fbid != null && userProfile.fbid!= undefined)){

           var id = userProfileData.fbid;
      	   //console.log("userProfile fbid a updatear: " + id);

      	  // UserProfile.find({"fbid":id},function(err,value){

           //if(value != null && value.length != 0){
                        //console.log("Id a realizar update:"+value._id);
                        //userProfileData._id = value._id;
                        UserProfile.findOneAndUpdate({"fbid":id},userProfileData,function(err){
				if(err){
					console.log(err);
					callback(err,'Error update user profile');
				}
				console.log('Updating usersProfile');
				callback(null,userProfileData);
			});

	    //}else if(value!=null){
		//	console.log('No se encontro el perfil del usuario con id ', id);
		//	err = new NotFound("UserProfile not exist");
		 //       callback(err,null);
	   // }
     	   //});
      }else{
           err = BadRequest("No se pudo procesar el request");
	   callback(err,null);
      }
};


exports.deleteUsersProfile = function (callback) {

      	   UserProfile.remove({},function(err,values){

         	if(err){
			console.log(err);
			callback(err,null);
		}

		console.log("borrando users profile");
		callback(null);
	   });
};
