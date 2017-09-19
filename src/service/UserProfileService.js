var dao = require('../dao/UserProfileDao');
var utils = require('../utils/Utils');
//var BadRequest = require("../error/BadRequest");
var NotFound = require("../error/NotFound");
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
        if(response == null) {
            err = new NotFound("No se encontro el usuario");
		    callback(err, null);
            return;
	    }
        response.metadata = utils.getMetadata(1);
        callback(null, response);
    });
};


/**
 * Save UserProfile 
 * @param {Request} Request
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.saveUserProfile = function (userProfile, callback) {
    /*
    var isValid = jsonValidator.isUserProfileValid(userProfile);
    if (!isValid) {
        callback(new BadRequest("Invalid UserProfile's json format"));
        return;
    }
    */

    dao.saveUserProfile(userProfile, function (err, response) {
        if (err) {
            callback(err, response);
            return;
        }
        callback(null, response);
    });
};

/**
 * Update userProfile 
 * @param {Request} Request
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.updateUserProfile = function (userProfile, callback) {
    /*
    var isValid = jsonValidator.isUserProfileValid(userProfile);
    if (!isValid) {
        callback(new BadRequest("Invalid UserProfile's json format"));
        return;
    }
    */

    dao.updateUserProfile(userProfile, function (err, response) {
        if (err) {
            callback(err, response);
            return;
        }
        callback(null, response);
    });
};

/**
 * Update deleteUsersProfile
 * @param {Request} Request
 * @param {Function} callback  The function to call when retrieval is complete.
 */
exports.deleteUsersProfile = function (callback) {
    /*
    var isValid = jsonValidator.isUserProfileValid(userProfile);
    if (!isValid) {
        callback(new BadRequest("Invalid UserProfile's json format"));
        return;
    }
    */

    dao.deleteUsersProfile(function (err, response) {
        if (err) {
            callback(err, response);
            return;
        }
        callback(null, response);
    });
};


