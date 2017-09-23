require('./db');

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

const ImageSchema = new Schema({
    fbidUser: String,
    idImage: String,
    data: String
},{ collection: 'images' });

// make this available to our users in our Node applications
module.exports = mongoose.model("Image", ImageSchema);
