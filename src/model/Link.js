require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const UserLinkSchema = new Schema({

    fbidUser: String,
    acceptedUsers: [
        {
            fbidCandidate: String,
            typeOfLink: {type: String, default: "Link"},
            countOfSuperLinks: {type: Number, default: 0},
            time : {
                type : Date,
                default: Date.now
            }
        }
    ]
},{ collection: 'links' });

// make this available to our users in our Node applications
module.exports = mongoose.model("Link", UserLinkSchema);
