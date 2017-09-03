var service = require('../service/UserProfileService');
var errorHandler = require('../utils/ErrorHandler');


//GET - Return all UsersProfile by name pattern
exports.getUsersProfile = function (req, res) {
    console.log('GET /usersProfile');
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
    console.log('GET /userProfile');
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

  console.log('POST /userProfile');

  service.saveUserProfile(req, function(err, response) {
    if (err) {
      return errorHandler.throwError(res, err);
    }

    return res.json(response);
  });
};

