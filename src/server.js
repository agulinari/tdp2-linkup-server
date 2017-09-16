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

//GET Array<UserProfile>
app.get('/usersProfile', function (req,res,next){
  try{    
    userProfileCtrl.getUsersProfile(req, res);	
 }catch(err){
    console.log('ERROR INESPERADO: '+err);
    return res.sendStatus(500);
 }
});

//GET UserProfile
app.get('/userProfileById/:id', function (req, res, next) {
 try{
    userProfileCtrl.getUserProfileById(req, res);
 }catch(err){
    console.log('ERROR INESPERADO: '+err);
    return res.sendStatus(500);
 }
});

//POST UserProfile
app.post('/userProfile', function (req,res,next){
  try{ 
     userProfileCtrl.saveUserProfile(req, res);	
  }catch(err){
     console.log('ERROR INESPERADO: '+err);
     return res.sendStatus(500);
  }
});

//PUT UserProfile
app.put('/userProfile', function (req,res,next){
 try{
    userProfileCtrl.updateUserProfile(req, res);
 }catch(err){
    console.log('ERROR INESPERADO: '+err);
    return res.sendStatus(500);
 }
});

//DELETE ALL UsersProfile
app.delete('/usersProfile', function (req,res,next){
 try{ 
   userProfileCtrl.deleteUsersProfile(res);
 }catch(err){
   console.log('ERROR INESPERADO: '+err);
   return res.sendStatus(500);
 }
});

var candidateCtrl = require(process.cwd() + '/src/controllers/CandidateController');
app.get('/candidate/:id', function (req,res,next) {
    console.log('GET /candidate/' + req.params.id);
    try{    
        candidateCtrl.getCandidates(req, res);	
    } catch (err) {
        console.log('ERR GET /candidate/:id: ' + err);
        return res.sendStatus(500);
    }
});

app.all('*', function (req,res,next) {
    return res.sendStatus(401);
    next();
});

// Start server
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

module.exports = app; // for testing
