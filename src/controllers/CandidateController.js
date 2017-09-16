var service = require('../service/CandidateService');
var errorHandler = require('../utils/ErrorHandler');

//GET - Return all candidates for an user
exports.getCandidates = function (req, res) {
    service.getCandidates(req.params.id, function (err, response) {
        if (err) {
            console.log(err);
            return errorHandler.throwError(res, err);
        }
        return res.json(response);
    });
};

