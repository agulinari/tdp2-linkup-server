var blockCtrl = require('../controllers/BlockController');

module.exports = function (app) {

    app.get('/block/:idBlockerUser/:idBlockedUser', function (req, res, next) {
        console.log('GET /block/:idBlockerUser/:idBlockedUser '
                    + JSON.stringify(req.params));
        try{
            blockCtrl.getBlock(req, res);
        } catch (err) {
            console.log('GET /block/:idBlockerUser/:idBlockedUser '
                        + JSON.stringify(req.params) + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.get('/block/:idBlockerUser', function (req, res, next) {
        console.log('GET /block/' + req.params.idBlockerUser);
        try{
            blockCtrl.getUserBlocks(req, res);
        } catch (err) {
            console.log('GET /block/' + req.params.idBlockerUser + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.get('/block', function (req, res, next) {
        console.log('GET /block');
        try{
            blockCtrl.getBlocks(req, res);
        } catch (err) {
            console.log('GET /block\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/block/:idBlockerUser/:idBlockedUser', function (req, res, next) {
        console.log('DELETE /block ' + JSON.stringify(req.params));
        try{
            blockCtrl.deleteBlock(req, res);
        } catch (err) {
            console.log('DELETE /block/:idBlockerUser/:idBlockedUser '
                        + JSON.stringify(req.params) + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/block/:idBlockerUser', function (req, res, next) {
        console.log('DELETE /block ' + JSON.stringify(req.params));
        try{
            blockCtrl.deleteUserBlocks(req, res);
        } catch (err) {
            console.log('DELETE /block/:idBlockerUser '
                        + JSON.stringify(req.params) + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/block', function (req, res, next) {
        console.log('DELETE /block');
        try{
            blockCtrl.deleteBlocks(req, res);
        } catch (err) {
            console.log('DELETE /block' + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.post('/block', function (req, res, next) {
        console.log('POST /block ' + JSON.stringify(req.body));
        try{
            blockCtrl.postBlock(req, res);
        } catch (err) {
            console.log('ERR POST /block '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });

};

