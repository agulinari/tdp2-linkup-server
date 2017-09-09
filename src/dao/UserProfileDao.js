'use strict';

var UserProfile = require('../model/UserProfile');

/**
 * Retrieves an List of Subjects
 * @param {Array} list of subject ids.
 * @param {Function} callback  The function to call when retrieval is complete.
 **/
exports.getUserProfileById = function(id, callback) {
    console.log('Retrieving UserProfile with id: ' + id);
    
    var profile = {
        "UserProfile":{
            "fbId":"012ProbandoId",
            "Name":"Pablo Daniel Sívori",
            "Occupation":"Estudiante",
            "Education":"Licenciado en todo",
            "Comments":"Juan es shemale los sabados después de las 00:00",
            "Birthdate":"1984-05-30",
            "Sex":"M",
            "Notifications":1,
            "Invisible":0,
            "accountType":"Basic",
            "Images":[
                {
                    "Image":{
                        "Id":"img_1",
                        "Order":1,
                        "Data":"la imagen"
                    }
                }
            ],
            "Interests":[
                {
                    "Interest":{

                    }
                }
            ],
            "Settings":{
                "maxRange":20,
                "minAge":18,
                "maxAge":34,
                "onlyFriends":1, //Only friends sino mi jermu aplica garrote garrote
                "searchMales":0,
                "searchFemales":0,
                "searchSheMales":0,
                "location":[
                    {
                        "lat":37.2,
                        "lon":34.2
                    }
                ]
            }
        }
    };

    
    
    /*
    UserProfile.find({"fbId":id},function (err, value) {
        if (err){
            console.log('Error: ' + err);
            callback(err,null);
        }
	    callback(null, value);
    });
    */
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
