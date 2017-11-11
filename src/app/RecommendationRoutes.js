var recommendationCtrl = require('../controllers/RecommendationController');

module.exports = function (app) {

    app.get('/recommendation/:idUser', (req, res, next) => {
        console.log('GET /recommendation/' + req.params.idUser);
        try{
            recommendationCtrl.getRecommendationsToUser(req, res);
        } catch (err) {
            console.log('GET /recommendation/' + req.params.idUser + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.get('/recommendation', function (req, res, next) {
        console.log('GET /recommendation');
        try{
            recommendationCtrl.getRecommendations(req, res);
        } catch (err) {
            console.log('GET /recommendation\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/recommendation/:idUser', function (req, res, next) {
        console.log('DELETE /recommendation ' + JSON.stringify(req.params));
        try{
            recommendationCtrl.deleteRecommendationsToUser(req, res);
        } catch (err) {
            console.log('DELETE /recommendation/:idUser '
                        + JSON.stringify(req.params) + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/recommendation/:idToUser/:idRecommendedUser',
               (req, res, next) => {
        console.log('DELETE /recommendation ' + JSON.stringify(req.params));
        try{
            recommendationCtrl.deleteUserRecommendationsToUser(req, res);
        } catch (err) {
            console.log('DELETE /recommendation//:idToUser/:idRecommendedUser '
                        + JSON.stringify(req.params) + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/recommendation', function (req, res, next) {
        console.log('DELETE /recommendation');
        try{
            recommendationCtrl.deleteRecommendations(req, res);
        } catch (err) {
            console.log('DELETE /recommendation' + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.post('/recommendation', function (req, res, next) {
        console.log('POST /recommendation ' + JSON.stringify(req.body));
        try{
            recommendationCtrl.postRecommendation(req, res);
        } catch (err) {
            console.log('ERR POST /recommendation '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });
    
};

