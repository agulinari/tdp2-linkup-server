'use strict';

var UserProfile = require('../model/UserProfile');

/**
 * Retrieves an List of Subjects
 * @param {Array} list of subject ids.
 * @param {Function} callback  The function to call when retrieval is complete.
 **/
exports.getUserProfileById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving UserProfile with id: ' + id);
    
};

exports.getUsersProfile = function(term,offset,count,callback) {
      console.log("offset " + offset);
      console.log("count " + count);
      UserProfile.find({"name":{ "$regex": "^" + term, "$options": "i" }},function (err, values) {
      if (err){
           console.log('Error: ' + err);
	   callback(err,null);
      }
	callback(null, values);
    }).sort('name').skip(offset).limit(count);    
};
