'use strict';

var UserProfile = require('../model/UserProfile');
var NotFound = require("../error/NotFound");
var BadRequest = require("../error/BadRequest");

exports.getUserProfileByCriteria = function(criteria, callback) {
    var projection = "-settings -_id -__v -images";
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
    UserProfile.find(query, projection, function (err, value) {
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

