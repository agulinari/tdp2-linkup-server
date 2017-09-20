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
    console.log('GET /rejection/:idUser/:idCandidate ' + JSON.stringify(req.params));
    try{
        rejectionCtrl.getUserCandidateRejection(req, res);
    } catch (err) {
        console.log('GET /rejection/:idUser/:idCandidate '
                    + JSON.stringify(req.params) + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.get('/rejection/:idUser', function (req, res, next) {
    console.log('GET /rejection/' + req.params.idUser);
    try{
        rejectionCtrl.getUserRejections(req, res);
    } catch (err) {
        console.log('GET /rejection/' + req.params.idUser + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.get('/rejection', function (req, res, next) {
    console.log('GET /rejection');
    try{
        rejectionCtrl.getRejections(req, res);
        //rejectionCtrl.deleteRejections(req, res);
    } catch (err) {
        console.log('GET /rejection\n'+ err);
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
        rejectionCtrl.deleteUserRejections(req, res);
    } catch (err) {
        console.log('DELETE /rejection/:idUser '
                    + JSON.stringify(req.params) + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.delete('/rejection', function (req, res, next) {
    console.log('DELETE /rejection');
    try{
        rejectionCtrl.deleteRejections(req, res);
    } catch (err) {
        console.log('DELETE /rejection' + '\n'+ err);
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

var linkCtrl = require(process.cwd() + '/src/controllers/LinkController');

app.post('/link', function (req, res, next) {
    console.log('POST /link ' + JSON.stringify(req.body));
    try{
        linkCtrl.postLink(req, res);
    } catch (err) {
        console.log('ERR POST /link '
                    + JSON.stringify(req.body) + '\n'
                    + err);
        return res.sendStatus(500);
    }
});

app.get('/link/:idUser/:idCandidate', function (req, res, next) {
    var url = '/link/' + req.params.idUser + '/' + req.params.idCandidate;
    console.log('GET ' + url);
    try{
        linkCtrl.getUserCandidateLink(req, res);
    } catch (err) {
        console.log('GET ' + url + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.get('/link/:idUser', function (req, res, next) {
    var url = '/link/' + req.params.idUser;
    console.log('GET ' + url);
    try{
        linkCtrl.getUserLinks(req, res);
    } catch (err) {
        console.log('GET ' + url + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.get('/link', function (req, res, next) {
    console.log('GET /link');
    try{
        linkCtrl.getLinks(req, res);
        //linkCtrl.deleteLinks(req, res);
    } catch (err) {
        console.log('GET /link\n'+ err);
        return res.sendStatus(500);
    }
});

app.delete('/link/:idUser/:idCandidate', function (req, res, next) {
    var url = '/link/' + req.params.idUser + '/' + req.params.idCandidate;
    console.log('DELETE ' + url);
    try{
        linkCtrl.deleteLink(req, res);
    } catch (err) {
        console.log('DELETE ' + url + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.delete('/link/:idUser', function (req, res, next) {
    var url = '/link/' + req.params.idUser;
    console.log('DELETE ' + url);
    try{
        linkCtrl.deleteUserLinks(req, res);
    } catch (err) {
        console.log('DELETE ' + url + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.delete('/link', function (req, res, next) {
    console.log('DELETE /link');
    try{
        linkCtrl.deleteLinks(req, res);
    } catch (err) {
        console.log('DELETE /link' + '\n'+ err);
        return res.sendStatus(500);
    }
});

var matchCtrl = require(process.cwd() + '/src/controllers/MatchController');

app.get('/match/:idUser', function (req, res, next){
    console.log('GET /match');
    try{
        matchCtrl.getUserMatches(req, res);
    } catch (err) {
        console.log('GET /match' + '\n'+ err);
        return res.sendStatus(500);
    }
});

app.delete('/match',function(req,res,nect){
    console.log('DELETE /match');
    try{
        matchCtrl.deleteMatches(req, res);
    } catch (err) {
        console.log('DELETE /Match' + '\n'+ err);
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
