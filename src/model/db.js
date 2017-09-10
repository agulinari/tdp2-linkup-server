exports = mongoose = require('mongoose');
//var connectionUri = "mongodb://127.0.0.1/dbtp0";
var connectionUri = "mongodb://mongo:mongo@ds131854.mlab.com:31854/linkup";
mongoose.connect(connectionUri,{ useMongoClient: true });
exports = Schema = mongoose.Schema;
