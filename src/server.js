var config = require("./config/Config");
var express = require("express");
var bodyParser = require("body-parser");
var url = require('url');
var app = express();

app.use(bodyParser.json({
	limit: '50mb'
}));
app.use(bodyParser.urlencoded({
	limit: '50mb',
	extended: true
}));

// Load routes
require('./app/UserRoutes.js')(app);
require('./app/ImageRoutes.js')(app);
require('./app/CandidateRoutes.js')(app);
require('./app/RejectionRoutes.js')(app);
require('./app/BlockRoutes.js')(app);
require('./app/LinkRoutes.js')(app);
require('./app/MatchRoutes.js')(app);
require('./app/AbuseReportRoutes.js')(app);
require('./app/AdRoutes.js')(app);
require('./app/CleanRoutes.js')(app);
require('./app/StatRoutes.js')(app);

app.all('*', function (req,res,next) {
    return res.sendStatus(401);
    next();
});

// Start server
app.listen(config.server.port, function() {
	console.log('Node app is running on port:', config.server.port);
});

// Start Super-Link schedule task
var userService = require('./service/UserService');
var cron = require('node-cron');
cron.schedule('*/10 * * * *', function(){
    console.log('Updating link counter every ten minutes');
    console.log(new Date);
    userService.resetSuperlinkCounter((err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        //console.log(data);
    });
});

// Start listening firebase notifications
var firebaseService = require("./service/FirebaseService");
firebaseService.listenForNotificationRequests();

module.exports = app; // for testing
