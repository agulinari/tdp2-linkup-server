var matchCtrl = require('../controllers/MatchController');

module.exports = function (app) {

    app.get('/match/:idUser', function (req, res, next){
        console.log('GET /match');
        try{
            matchCtrl.getUserMatches(req, res);
        } catch (err) {
            console.log('GET /match' + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/match',function(req,res,nect){
        console.log('DELETE /match');
        try{
            matchCtrl.deleteMatches(req, res);
        } catch (err) {
            console.log('DELETE /Match' + '\n'+ err);
            return res.sendStatus(500);
        }
    });
    
};


