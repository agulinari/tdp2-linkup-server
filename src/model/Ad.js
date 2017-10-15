require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const AdSchema = new Schema({
    advertiser: String,
    image: String,
    url: String,
    time : { type : Date, default: Date.now },
    isActive: { type: Boolean, default: true }
},{ collection: 'ads' });

// make this available to our users in our Node applications
module.exports = mongoose.model("Ad", AdSchema);
