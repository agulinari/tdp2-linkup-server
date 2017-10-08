var linkCtrl = require('../controllers/LinkController');

module.exports = function (app) {

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

    app.post('/linksUsersCandidate', function (req, res, next) {
        console.log('POST /linksUsersCandidate ' + JSON.stringify(req.body));
        try{
            linkCtrl.getLinksUsersByCandidate(req, res);
        } catch (err) {
            console.log('ERR POST /linksUsersCandidate '
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
    
};


