require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const RecommendationSchema = new Schema({
    idFromUser: String,
    idToUser: String,
    idRecommendedUser: String,
    time : { type : Date, default: Date.now }
},{ collection: 'recommendations' });

// make this available to our users in our Node applications
module.exports = mongoose.model("Recommendation", RecommendationSchema);
