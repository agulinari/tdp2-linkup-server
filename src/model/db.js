var config = require('../config/Config');

exports = mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.database.connectionUri, { useMongoClient: true });
exports = Schema = mongoose.Schema;
