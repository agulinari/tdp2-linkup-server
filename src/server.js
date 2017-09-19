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
app.get('/candidate/:id', function (req, res, next) {
    console.log('GET /candidate/' + req.params.id);
    try{    
        candidateCtrl.getCandidates(req, res);	
    } catch (err) {
        console.log('ERR GET /candidate/:id: ' + err);
        return res.sendStatus(500);
    }
});

var imageCtrl = require(process.cwd() + '/src/controllers/ImageController');
app.get('/image/:idUser/:idImage', function (req, res, next) {
    var url = '/image/' + req.params.idUser + '/' + req.params.idImage;
    console.log('GET ' + url);
    try{    
        imageCtrl.getImage(req, res);	
    } catch (err) {
        console.log('ERR GET ' + url + '\n' + err);
        return res.sendStatus(500);
    }
});

var rejectionCtrl = require(process.cwd() + '/src/controllers/RejectionController');

app.get('/rejection/:idUser/:idCandidate', function (req, res, next) {
    console.log('GET /rejection ' + JSON.stringify(req.params));
    try{    
        rejectionCtrl.getRejection(req, res);	
    } catch (err) {
        console.log('GET /rejection/:idUser/:idCandidate '
                    + JSON.stringify(req.params) + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.delete('/rejection/:idUser/:idCandidate', function (req, res, next) {
    console.log('DELETE /rejection ' + JSON.stringify(req.params));
    try{    
        rejectionCtrl.deleteRejection(req, res);	
    } catch (err) {
        console.log('DELETE /rejection/:idUser/:idCandidate '
                    + JSON.stringify(req.params) + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.delete('/rejection/:idUser', function (req, res, next) {
    console.log('DELETE /rejection ' + JSON.stringify(req.params));
    try{    
        rejectionCtrl.deleteAllRejections(req, res);	
    } catch (err) {
        console.log('DELETE /rejection/:idUser '
                    + JSON.stringify(req.params) + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.post('/rejection', function (req, res, next) {
    console.log('POST /rejection ' + JSON.stringify(req.body));
    try{    
        rejectionCtrl.postRejection(req, res);	
    } catch (err) {
        console.log('ERR POST /rejection '
                    + JSON.stringify(req.body) + '\n'
                    + err);
        return res.sendStatus(500);
    }
});

var userLinkCtrl = require(process.cwd() + '/src/controllers/UserLinkController');
app.post('/link/:idUser/:idCandidate', function(req, res, next){
    console.log('POST /link ' + JSON.stringify(req.body));
    try{
        userLinkCtrl.postLink(req, res);
    } catch (err) {
         console.log('POST /link/:idUser/:idCandidate '
                    + JSON.stringify(req.params) + '\n'+ err);
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
