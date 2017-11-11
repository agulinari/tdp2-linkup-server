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
    
    app.get('/stat/user/ActiveStatus', function (req, res, next) {
        console.log('GET /stat/user/ActiveStatus');
        try{
            statCtrl.getUserActiveBlockedStats(req, res);
        } catch (err) {
            console.log('GET /stat/user/ActiveStatus\n'+ err);
            return res.sendStatus(500);
        }
    });
    
    app.get('/stat/user/ActiveStatus/PremiumStatus', function (req, res, next) {
        console.log('GET /stat/user/ActiveStatus/PremiumStatus');
        try{
            statCtrl.getUserPremiumBasicByActiveStatusStats(req, res);
        } catch (err) {
            console.log('GET /stat/user/ActiveStatus/PremiumStatus\n'+ err);
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


