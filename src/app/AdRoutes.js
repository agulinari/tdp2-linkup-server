var adCtrl = require('../controllers/AdController');

module.exports = function (app) {

    app.get('/ad', function (req, res, next) {
        console.log('GET /ad');
        try{
            adCtrl.getAds(req, res);
        } catch (err) {
            console.log('GET /ad\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.post('/ad', function (req, res, next) {
        console.log('POST /ad ' + JSON.stringify(req.body));
        try{
            adCtrl.postAd(req, res);
        } catch (err) {
            console.log('ERR POST /ad '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });

    app.put('/ad', function (req, res, next) {
        console.log('PUT /ad ' + JSON.stringify(req.body));
        try{
            adCtrl.putAd(req, res);
        } catch (err) {
            console.log('ERR PUT /ad '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });

    app.delete('/ad', function (req, res, next) {
        console.log('DELETE /ad');
        try{
            adCtrl.deleteAds(req, res);
        } catch (err) {
            console.log('DELETE /ad' + '\n'+ err);
            return res.sendStatus(500);
        }
    });
    
};


