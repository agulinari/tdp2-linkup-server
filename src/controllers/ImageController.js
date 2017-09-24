var service = require('../service/ImageService');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');

//GET - Return an Image for an user
exports.getImage = function (req, res) {
    var idUser = req.params.idUser;
    var idImage = req.params.idImage;
    service.getImage(idUser, idImage, function (err, image) {
        if (err) {
            console.log(err);
            return errorHandler.throwError(res, err);
        }
        var response = {
            'image': image,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//GET - Returns the user Images
exports.getImages = function(req, res) {
    var idUser = req.params.idUser;
    service.getImages(idUser, function(err, images) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'images': images,
            metadata : utils.getMetadata(images.length)
        }
        return res.json(response);
    });
};

//GET - Returns the user Images
exports.getAllImages = function(req, res) {
    service.getAllImages(function(err, images) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'images': images,
            metadata : utils.getMetadata(images.length)
        }
        return res.json(response);
    });
};

//POST - Save a new Image
exports.postImage = function(req, res) {
    var imageData = req.body.image;
    /*
    var isValid = jsonValidator.isImageValid(imageData);
    if (!isValid) {
        callback(new BadRequest("Invalid Image's json format"));
        return;
    }
    */
    service.saveImage(imageData.fbidUser,
                      imageData.idImage,
                      imageData.data,
                      function(err, image) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'image': image,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//DELETE - Deletes an Image
exports.deleteImage = function(req, res) {
    var idUser = req.params.idUser;
    var idImage = req.params.idImage;
    service.deleteImage(idUser, idImage, function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//DELETE - Deletes all User Images
exports.deleteImages = function(req, res) {
    var idUser = req.params.idUser;
    service.deleteImages(idUser, function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.deleteAllImages = function(req, res) {
    service.deleteAllImages(function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'data': data,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};


