var candidateCtrl = require('../controllers/CandidateController');

module.exports = function (app) {

    app.get('/candidate/:id', function (req, res, next) {
        console.log('GET /candidate/' + req.params.id);
        try{
            candidateCtrl.getCandidates(req, res);
        } catch (err) {
            console.log('ERR GET /candidate/:id: ' + err);
            return res.sendStatus(500);
        }
    });
    
};


