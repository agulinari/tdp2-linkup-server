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

app.set('port', (process.env.PORT || 3000));

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

app.all('*', function (req,res,next) {
    return res.sendStatus(401);
    next();
});

// Start server
app.listen(app.get('port'), function() {
	console.log('Node app is running on port:', app.get('port'));
});

//Se integra con firebase

var firebase = require("firebase-admin");
var serviceAccount = require("./linkuptdp-firebase-key.json");
var API_KEY = "AAAAVU9hATc:APA91bE6lGLOsFV13kyQOevjJV64VrrIM4FCeLLXCewE8pJa8XY27OYl8Kn6X7PqpvDB5uvmcrnszeZMU4ii0DONkpCTU_LD-iX0G_ZKDKseyxGHGYc1ozRX_iagbHA7lwQM9F0LtEyu";

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://linkuptdp.firebaseio.com"
});

ref = firebase.database().ref();

function listenForNotificationRequests() {
  var requests = ref.child('notifications');
  requests.on('child_added', function(requestSnapshot) {
    var request = requestSnapshot.val();
    console.log("Request: "+JSON.stringify(request));
    sendNotificationToUser(request.fbidTo, request.fbid, request.messageTitle,
      request.messageBody, request.firstName, request.motive,
      function() {
        requestSnapshot.ref.remove();
      }
    );
  }, function(error) {
    console.error(error);
  });
};

var userService = require(process.cwd() + '/src/service/UserService');

function sendNotificationToUser(fbidTo, fbidFrom, title, message, firstName, motive, onSuccess) {
	
 
    userService.getUser(fbidTo,function (err, value){

        if(value!=null && value.token!=null){

            var token = value.token;
            var payload = {
                data: {
                    fbid: fbidFrom,
                    fbidTo: fbidTo,
                    title: title,
                    body: message,
                    firstName: firstName,
                    motive: motive
                }
            };

            firebase.messaging().sendToDevice(token, payload).then(function(response) {
                // See the MessagingDevicesResponse reference documentation for
                // the contents of response.
                console.log("Successfully sent message:", response);
                onSuccess();
            }).catch(function(error) {
                console.log("Error sending message:", error);
                return;
            });
        }
        return;
    });
}

// start listening
listenForNotificationRequests();

module.exports = app; // for testing
