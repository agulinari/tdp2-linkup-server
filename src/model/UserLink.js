require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const UserLinkSchema = new Schema({

    fbidUser: {
        type: String,
        unique: true,
        index: true
    },
    acceptedUsers: [
        {
            "fbidCandidate": {
                              type: String,
                              unique: true,
                              index: true
            },
	        "typeOfLink": {type: String, default: "Link"},
            "countOfSuperLinks": {type: Number, default: 0},
	    }
	]
},{ collection: 'usersLink' });

// make this available to our users in our Node applications
module.exports = mongoose.model("UserLink", UserLinkSchema);
