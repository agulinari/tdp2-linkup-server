var config = {};

config.server = {};
config.app = {};
config.database = {};
config.firebase = {};

config.server.port = process.env.SERVER_PORT || 3000;

config.app.superlinkCount = 2;
config.app.adRate = 2;

//config.database.connectionUri = "mongodb://127.0.0.1/dbtp0";
config.database.connectionUri = "mongodb://mongo:mongo@ds131854.mlab.com:31854/linkup";

module.exports = config;
