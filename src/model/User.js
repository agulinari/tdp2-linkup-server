require('./db');

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
    birthday: String,
    comments: String,
    education: String,
    fbid: String,
    token: String,
    firstName: String,
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
    lastName: String,
    location: {
        "longitude": Number,
        "latitude": Number,
        "name": String
    },
    occupation: String,
    settings: {
	    fbid: String,
        invisible: {type: Boolean}, //True: 1, False: 0
	    maxRange : Number,
	    maxAge: Number,
        maxDistance : Number,
	    minAge: Number,
	    accountType: {type: String, default: "Basic"},
	    notifications: {type: Boolean}, //True: 1, False: 0
        onlyFriends: {type: Boolean}, //True: 1, False: 0
	    searchMales: {type: Boolean}, //True: 1, False: 0
	    searchFemales: {type: Boolean} //True: 1, False: 0
	},
	control: {
	    isActive: {type: Boolean, default: true},
	    deactivationTime: { type : Date, default: null }
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
