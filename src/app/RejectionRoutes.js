var rejectionCtrl = require('../controllers/RejectionController');

module.exports = function (app) {

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
    
};


