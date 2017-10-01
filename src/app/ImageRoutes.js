var imageCtrl = require('../controllers/ImageController');

module.exports = function (app) {

    app.get('/image/:idUser/:idImage', function (req, res, next) {
        var url = '/image/' + req.params.idUser + '/' + req.params.idImage;
        console.log('GET ' + url);
        try{
            imageCtrl.getImage(req, res);
        } catch (err) {
            console.log('GET ' + url + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.get('/image/:idUser', function (req, res, next) {
        console.log('GET /image/' + req.params.idUser);
        try{
            imageCtrl.getImages(req, res);
        } catch (err) {
            console.log('GET /image/' + req.params.idUser + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.get('/image', function (req, res, next) {
        console.log('GET /image');
        try{
            imageCtrl.getAllImages(req, res);
        } catch (err) {
            console.log('GET /image' + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.post('/image', function (req, res, next) {
        console.log('POST /image ' + JSON.stringify(req.body));
        try{
            imageCtrl.postImage(req, res);
        } catch (err) {
            console.log('ERR POST /image '
                        + JSON.stringify(req.body) + '\n'
                        + err);
            return res.sendStatus(500);
        }
    });

    app.delete('/image/:idUser/:idImage', function (req, res, next) {
         var url = '/image/' + req.params.idUser + '/' + req.params.idImage;
        console.log('DELETE ' + url);
        try{
            imageCtrl.deleteImage(req, res);
        } catch (err) {
            console.log('DELETE ' + url + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/image/:idUser', function (req, res, next) {
        console.log('DELETE /image ' + req.params.idUser);
        try{
            imageCtrl.deleteImages(req, res);
        } catch (err) {
            console.log('DELETE /image/' + req.params.idUser + '\n'+ err);
            return res.sendStatus(500);
        }
    });

    app.delete('/image', function (req, res, next) {
        console.log('DELETE /image');
        try{
            imageCtrl.deleteAllImages(req, res);
        } catch (err) {
            console.log('DELETE /image/' + '\n'+ err);
            return res.sendStatus(500);
        }
    });
    
};


