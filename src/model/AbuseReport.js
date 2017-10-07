require('./db');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const AbuseReportSchema = new Schema({
    idReporter: String,
    fullnameReporter: String,
    idReported: String,
    fullnameReported: String,
    time : { type : Date, default: Date.now },
    idCategory: Number,
    comment: String,
    isOpen: { type: Boolean, default: true }
},{ collection: 'abuseReports' });

// make this available to our users in our Node applications
module.exports = mongoose.model("AbuseReport", AbuseReportSchema);
