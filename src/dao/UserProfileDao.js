'use strict';

var UserProfile = require('../model/UserProfile');

/**
 * Retrieves an List of Subjects
 * @param {Array} list of subject ids.
 * @param {Function} callback  The function to call when retrieval is complete.
 **/
exports.getUserProfileById = function(id, callback) {
    console.log('Retrieving UserProfile with id: ' + id);
    UserProfile.find({"fbId":id},function (err, value) {
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
