//Module dependencies
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

var userProfileCtrl = require(process.cwd() + '/src/controllers/UserProfileController');

//GET Array<UsersProfile>
app.get('/usersProfile', function (req,res,next){
    userProfileCtrl.getUsersProfile(req, res);	
});

//GET UserProfile
app.get('/userProfile/:id', function (req, res, next) {
    userProfileCtrl.getUserProfileById(req, res);
});
 
app.all('*', function (req,res,next) {
    console.log('NOPE');
    return res.sendStatus(401);
    next();
});

// Start server
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

module.exports = app; // for testing
