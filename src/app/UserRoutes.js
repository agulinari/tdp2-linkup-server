var userCtrl = require('../controllers/UserController');

module.exports = function (app) {

    app.get('/user', function (req,res,next) {
        console.log('GET /user');
        try {
            userCtrl.getUsers(req, res);
        } catch (err) {
            console.log('ERR GET /user ' + '\n' + err);
            return res.sendStatus(500);
        }
    });

    app.get('/user/:idUser', function (req, res, next) {
        console.log('GET /user/' + req.params.idUser);
        try{
            userCtrl.getUser(req, res);
        } catch (err) {
            console.log('GET /user/' + req.params.idUser + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.post('/user', function (req, res, next) {
        console.log('POST /user ' /*+ JSON.stringify(req.body)*/);
        try{
            userCtrl.postUser(req, res);
        } catch (err) {
            console.log('ERR POST /user '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });

    app.put('/user', function (req, res, next) {
        console.log('PUT /user ' + JSON.stringify(req.body));
        try{
            userCtrl.putUser(req, res);
        } catch (err) {
            console.log('ERR PUT /user '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });

    app.delete('/user/:idUser', function (req, res, next) {
        console.log('DELETE /user ' + req.params.idUser);
        try{
            userCtrl.deleteUser(req, res);
        } catch (err) {
            console.log('DELETE /user/' + req.params.idUser + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/user', function (req, res, next) {
        console.log('DELETE /user');
        try{
            userCtrl.deleteAllUsers(req, res);
        } catch (err) {
            console.log('DELETE /user' + '\n'+ err);
            return res.sendStatus(500);
        }
    });
    
    app.put('/token',function(req,res,nect){
        console.log('PUT /token ' + JSON.stringify(req.body));
        try{
            userCtrl.putToken(req, res);
        } catch (err) {
            console.log('ERR PUT /token '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });
    
};


