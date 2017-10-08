require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const BlockSchema = new Schema({
    idBlockerUser: String,
    idBlockedUser: String,
    time : { type : Date, default: Date.now }
},{ collection: 'blocks' });

// make this available to our users in our Node applications
module.exports = mongoose.model("Block", BlockSchema);
