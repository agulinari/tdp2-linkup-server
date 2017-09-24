require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const UserMatchSchema = new Schema({

    fbidUser: String,
    matches: [
        {
            fbidUser: String,
            gender: String,
            name: String,
            lastName: String,
            age: String,
            avatarImage: String,
            time : String
	    }
	]
},{ collection: 'usersMatch' });

// make this available to our users in our Node applications
module.exports = mongoose.model("UserMatch", UserMatchSchema);
