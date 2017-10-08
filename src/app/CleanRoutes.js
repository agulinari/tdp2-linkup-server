var cleanCtrl = require('../controllers/CleanController');

module.exports = function (app) {

    app.get('/clean/user/:idUser', function (req, res, next) {
        var url = '/clean/user/' + req.params.idUser;
        console.log('GET ' + url);
        try{
            cleanCtrl.getCleanUser(req, res);
        } catch (err) {
            console.log('GET ' + url + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.get('/clean/user', function (req, res, next) {
        console.log('GET /clean/user');
        try{
            cleanCtrl.getCleanUsers(req, res);
        } catch (err) {
            console.log('GET /clean/user' + '\n'+ err);
            return res.sendStatus(500);
        }
    });
    
    app.get('/clean/AbuseReport', function (req, res, next) {
        console.log('GET /clean/AbuseReport');
        try{
            cleanCtrl.getCleanAbuseReports(req, res);
        } catch (err) {
            console.log('GET /clean/AbuseReport' + '\n'+ err);
            return res.sendStatus(500);
        }
    });
    
    app.get('/clean/block', function (req, res, next) {
        console.log('GET /clean/block');
        try{
            cleanCtrl.getCleanBlocks(req, res);
        } catch (err) {
            console.log('GET /clean/block' + '\n'+ err);
            return res.sendStatus(500);
        }
    });
    
};


