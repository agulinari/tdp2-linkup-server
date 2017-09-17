var service = require('../service/ImageService');
var errorHandler = require('../utils/ErrorHandler');

//GET - Return an Image for an user
exports.getImage = function (req, res) {
    var idUser = req.params.idUser;
    var idImage = req.params.idImage;
    service.getImage(idUser, idImage, function (err, response) {
        if (err) {
            console.log(err);
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

