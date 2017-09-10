var service = require('../service/UserProfileService');
var errorHandler = require('../utils/ErrorHandler');


//GET - Return all UsersProfile by name pattern
exports.getUsersProfile = function (req, res) {
    console.log('GET /getUsersProfile');
    var term = req.query.term ? req.query.term : "";
    var offset = req.query.offset ? parseInt(req.query.offset) : 0;
    var count = req.query.count ? parseInt(req.query.count) : 50;

    service.getUsersProfile(term,offset,count, function (err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//GET - Return UserProfile by facebookId
exports.getUserProfileById = function (req, res) {
    console.log('GET /getUserProfileById/*id');
    var id = req.params.id ? req.params.id : "";
    service.getUserProfileById(id, function (err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};


//POST - Insert a new UserProfile in db
exports.saveUserProfile = function(req, res) {
    console.log('POST /addUserProfile' + JSON.stringify(req.body));
    service.saveUserProfile(req.body, function (err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//PUT - Update a UserProfile in db
exports.updateUserProfile = function(req, res) {
    console.log('PUT /updateUserProfile' + JSON.stringify(req.body));
    service.updateUserProfile(req.body, function (err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

//DELETE - Delete All UsersProfile in db
exports.deleteUsersProfile = function(res) {
    console.log('DELETE /deleteUsersProfile');
    service.deleteUsersProfile(function (err, response) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

