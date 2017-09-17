require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const RejectionSchema = new Schema({
    fbidUser: String,
    fbidCandidate: String
},{ collection: 'rejections' });

// make this available to our users in our Node applications
module.exports = mongoose.model("Rejection", RejectionSchema);
