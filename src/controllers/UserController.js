var service = require('../service/UserService');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');

exports.getUsers = function (req, res) {
    service.getUsers(function(err, users) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'users': users,
            metadata : utils.getMetadata(users.length)
        }
        return res.json(response);
    });
};

exports.getUser = function (req, res) {
    var idUser = req.params.idUser;
    service.getUser(idUser, function (err, user) {
        if (err) {
            console.log(err);
            return errorHandler.throwError(res, err);
        }
        var response = {
            'user': user,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.postUser = function(req, res) {
    var userData = req.body.user;
    
    /*
    var isValid = jsonValidator.isUserValid(userData);
    if (!isValid) {
        callback(new BadRequest("Invalid User's json format"));
        return;
    }
    */
    service.saveUser(userData, function(err, user) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'user': user,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.putUser = function(req, res) {
    var userData = req.body.user;
    /*
    var isValid = jsonValidator.isUserValid(userData);
    if (!isValid) {
        callback(new BadRequest("Invalid User's json format"));
        return;
    }
    */
    service.updateUser(userData, function(err, user) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'user': user,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

exports.putToken = function(req, res){
    var fbid = req.body.fbid;
    var token = req.body.token;

     service.updateToken(fbid,token, function(err, data) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {'data': data,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
}

exports.deleteUser = function(req, res) {
    var idUser = req.params.idUser;
    service.deleteUser(idUser, function(err, data) {
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

exports.deleteAllUsers = function(req, res) {
    service.deleteAllUsers(function(err, data) {
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

