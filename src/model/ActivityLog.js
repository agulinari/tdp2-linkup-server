require('./db');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const ActivityLogSchema = new Schema({
    idUser: String,
    isPremium: Boolean,
    activityType: Number,
    time : { type : Date, default: Date.now },
    
},{ collection: 'activityLogs' });

// make this available to our users in our Node applications
module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
