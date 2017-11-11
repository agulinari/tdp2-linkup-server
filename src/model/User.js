require('./db');
var config = require('../config/Config');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
    time: String,
    typeOfLink: String,
    fbid: String,
    birthday: String,
    comments: String,
    education: String,
    firstName: String,
    lastName: String,
    gender: String,
    avatar: {
        "image": {
            "idImage": String}
    },
    images: [
        {
            _id:false,
            "image": {"idImage": String}
        }
	],
    interests : [{ "interest" : String}],
    location: {
        "longitude": Number,
        "latitude": Number,
        "name": String
    },
    occupation: String,
    settings: {
            invisible: {type: Boolean, default: false},
	           maxAge: {type: Number, default: 100},
          maxDistance: {type: Number, default: 500},
	           minAge: {type: Number, default: 18},
	    notifications: {type: Boolean, default: true},
	         blockAds: {type: Boolean, default: false},
          onlyFriends: {type: Boolean, default: false},
	      searchMales: {type: Boolean, default: true},
	    searchFemales: {type: Boolean, default: true}
	},
	control: {
	               isActive: {type: Boolean, default: true},
	       deactivationTime: { type : Date, default: null },
	              isPremium: {type: Boolean, default: false},
	                  token: String,
	    availableSuperlinks: {type: Number, default: config.app.superlinkCount}
	}
},{ collection: 'users' });

UserSchema.methods.toJSON = function() {
 var obj = this.toObject();
 delete obj.time;
 delete obj.typeOfLink;
 return obj;
}

// make this available to our users in our Node applications
module.exports = mongoose.model("User", UserSchema);
