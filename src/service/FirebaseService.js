var config = require("../config/Config");
var firebase = require("firebase-admin");
var serviceAccount = require("../linkuptdp-firebase-key.json");
var API_KEY = "AAAAVU9hATc:APA91bE6lGLOsFV13kyQOevjJV64VrrIM4FCeLLXCewE8pJa8XY27OYl8Kn6X7PqpvDB5uvmcrnszeZMU4ii0DONkpCTU_LD-iX0G_ZKDKseyxGHGYc1ozRX_iagbHA7lwQM9F0LtEyu";

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://linkuptdp.firebaseio.com"
});

ref = firebase.database().ref();

exports.listenForNotificationRequests = function () {
    var requests = ref.child('notifications');
    requests.on('child_added',
                (requestSnapshot) => {
        var request = requestSnapshot.val();
        console.log("Request: "+JSON.stringify(request));
        notifyUser(request.fbidTo,
                   request.fbid,
                   request.messageTitle,
                   request.messageBody,
                   request.firstName,
                   request.motive,
                   () => { requestSnapshot.ref.remove(); } );
        },
        (error) => { console.error(error); });
};

//Deberia usar UserService pero asi evito una dependencia circular
var userDao = require('../dao/UserDao');

function notifyUser(fbidTo, fbidFrom, title, message, firstName, motive, onSuccess) {
    userDao.findUser(fbidTo, (err, user) => {
        if (err) {
            console.log(err);
        }
        if (user != null && user.control.token != null) {
            var token = user.control.token;
            var payload = {
                data: {
                    'fbid': fbidFrom,
                    'fbidTo': fbidTo,
                    'title': title,
                    'body': message,
                    'firstName': firstName,
                    'motive': motive
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
        } else {
            console.log('ERROR: user or token is null')
        }
    });
}

exports.notifyUser = notifyUser;
