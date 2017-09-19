var service = require('../service/UserLinkService');
var errorHandler = require('../utils/ErrorHandler');

//GET - Return result of link user to candidate
exports.postLink = function (req, res) {
    service.linkCandidate(req.params.idUser,req.params.idCandidate, function (err, response) {
        if (err) {
            console.log(err);
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};
