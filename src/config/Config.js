var config = {};

config.server = {};
config.app = {};
config.database = {};
config.firebase = {};

config.server.port = process.env.PORT || 3000;

config.app.superlinkCount = 2;
config.app.adRate = 2;

config.database.connectionUri =
        (process.env.NODE_ENV === 'TEST')
        ? "mongodb://127.0.0.1/dbtp0"                               // TEST DB
        : "mongodb://mongo:mongo@ds131854.mlab.com:31854/linkup";   // PROD DB

module.exports = config;
