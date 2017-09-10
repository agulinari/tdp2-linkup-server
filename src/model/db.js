exports = mongoose = require('mongoose');
//var connectionUri = "mongodb://127.0.0.1/dbtp0";
var connectionUri = "mongodb://tdpuser:12345@ds023463.mlab.com:23463/dbtp0";
mongoose.connect(connectionUri,{ useMongoClient: true });
exports = Schema = mongoose.Schema;
