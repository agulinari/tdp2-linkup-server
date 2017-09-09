var dao = require('../dao/UserProfileDao');
var utils = require('../utils/Utils');
//var BadRequest = require("../error/BadRequest");
//var NotFound = require("../error/NotFound");
var jsonValidator = require('../utils/JsonValidator');

exports.getUsersProfile = function (term,offset,count, callback) {
/*
    if (! utils.isValidPattern(namePattern)) {
        callback(new BadRequest("Invalid City name"));
        return;
    }
*/
    dao.getUsersProfile(term,offset,count, function (err,response) {
       
        if (err) {
            console.log('hay error');
	    callback(err);
            return;
        }
        response.metadata = utils.getMetadata(response.length);
        callback(null, response);
    });
};


exports.getUserProfileById = function (id, callback) {
/*
    if (! utils.isValidPattern(namePattern)) {
        callback(new BadRequest("Invalid City name"));
        return;
    }
*/
    dao.getUserProfileById(id, function (err,response) {
        if (err) {
            console.log('hay error');
	        callback(err);
            return;
        }
        response.metadata = utils.getMetadata(response.length);
        callback(null, response);
    });
};


/**
 * Save UserProfile 
 * @param {Request} Request
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.saveUserProfile = function(req, callback) {

  var isValid = jsonValidator.isInterestValid(req.body);

  if (!isValid) {
    callback(new BadRequest("Invalid interest's json format"));
    return;
  }

  var interest = {
    category: req.body.interest.category,
    value: req.body.interest.value
  }
  var self = this;
  self.existsInterest(interest, function(err, exists, response) {
    if (err) {
      callback(err);
    } else if (exists) {
      callback(new BadRequest("Interest " + JSON.stringify(response) + " already exists."));
    } else {
      dao.saveInterest(interest, function(err, response) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
};

