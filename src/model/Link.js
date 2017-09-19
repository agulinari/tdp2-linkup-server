require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const LinkSchema = new Schema({
    fbidUser: String,
    fbidCandidate: String,
    time : {
        type : Date,
        default: Date.now
    }
},{ collection: 'links' });

// make this available to our users in our Node applications
module.exports = mongoose.model("Link", LinkSchema);
