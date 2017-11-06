var statCtrl = require('../controllers/StatController');

module.exports = function (app) {

    app.get('/stat/user/activity', function (req, res, next) {
        console.log('GET /stat/user/activity');
        try{
            statCtrl.getUserActivityStats(req, res);
        } catch (err) {
            console.log('GET /stat/user/activity\n'+ err);
            return res.sendStatus(500);
        }
    });
    
    app.get('/stat/AbuseReport', function (req, res, next) {
        console.log('GET /stat/AbuseReport');
        try{
            statCtrl.getAbuseReportStats(req, res);
        } catch (err) {
            console.log('GET /stat/AbuseReport\n'+ err);
            return res.sendStatus(500);
        }
    });
    
};


