var abuseReportCtrl = require('../controllers/AbuseReportController');

module.exports = function (app) {

    app.get('/AbuseReport', function (req, res, next) {
        console.log('GET /AbuseReport');
        try{
            abuseReportCtrl.getAbuseReports(req, res);
        } catch (err) {
            console.log('GET /AbuseReport\n'+ err);
            return res.sendStatus(500);
        }
    });
    
    app.get('/AbuseReport/open', function (req, res, next) {
        console.log('GET /AbuseReport/open');
        try{
            abuseReportCtrl.getOpenAbuseReports(req, res);
        } catch (err) {
            console.log('GET /AbuseReport/open\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.get('/AbuseReport/closed', function (req, res, next) {
        console.log('GET /AbuseReport/closed');
        try{
            abuseReportCtrl.getClosedAbuseReports(req, res);
        } catch (err) {
            console.log('GET /AbuseReport/closed\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.post('/AbuseReport', function (req, res, next) {
        console.log('POST /AbuseReport ' + JSON.stringify(req.body));
        try{
            abuseReportCtrl.postAbuseReport(req, res);
        } catch (err) {
            console.log('ERR POST /AbuseReport '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });
    
    app.put('/AbuseReport', function (req, res, next) {
        console.log('PUT /AbuseReport ' + JSON.stringify(req.body));
        try{
            abuseReportCtrl.putAbuseReport(req, res);
        } catch (err) {
            console.log('ERR PUT /AbuseReport '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });
    
    app.delete('/AbuseReport', function (req, res, next) {
        console.log('DELETE /AbuseReport');
        try{
            abuseReportCtrl.deleteAbuseReports(req, res);
        } catch (err) {
            console.log('DELETE /AbuseReport' + '\n'+ err);
            return res.sendStatus(500);
        }
    });
    
};


