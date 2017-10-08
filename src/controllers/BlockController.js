var service = require('../service/BlockService');
var jsonValidator = require('../utils/JsonValidator');
var errorHandler = require('../utils/ErrorHandler');
var utils = require('../utils/Utils');

//GET - Returns a Block from db
exports.getBlock = function(req, res) {
    var idBlockerUser = req.params.idBlockerUser;
    var idBlockedUser = req.params.idBlockedUser;
    service.getBlock(idBlockerUser, idBlockedUser, function(err, block) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'block': block,
            metadata : utils.getMetadata(block != null ? 1 : 0)
        }
        return res.json(response);
    });
};

//GET - Returns a Block from db
exports.getUserBlocks = function(req, res) {
    var idBlockerUser = req.params.idBlockerUser;
    service.getUserBlocks(idBlockerUser, function(err, blocks) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'blocks': blocks,
            metadata : utils.getMetadata(blocks.length)
        }
        return res.json(response);
    });
};

//GET - Returns a Block from db
exports.getBlocks = function(req, res) {
    service.getBlocks(function(err, blocks) {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'blocks': blocks,
            metadata : utils.getMetadata(blocks.length)
        }
        return res.json(response);
    });
};

//POST - Insert a new Block in db
exports.postBlock = function(req, res) {
    var b = req.body.block;
    /*
    var isValid = jsonValidator.isBlockValid(block);
    if (!isValid) {
        callback(new BadRequest("Invalid Block's json format"));
        return;
    }
    */
    service.saveBlock(b.idBlockerUser, b.idBlockedUser, (err, block) => {
        if (err) {
            return errorHandler.throwError(res, err);
        }
        var response = {
            'block': block,
            metadata : utils.getMetadata(1)
        }
        return res.json(response);
    });
};

//DELETE - Deletes a Block from db
exports.deleteBlock = function(req, res) {
    var idBlockerUser = req.params.idBlockerUser;
    var idBlockedUser = req.params.idBlockedUser;
    service.deleteBlock(idBlockerUser, idBlockedUser, function(err, data) {
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

//DELETE - Deletes all User Blocks from db
exports.deleteUserBlocks = function(req, res) {
    var idBlockerUser = req.params.idBlockerUser;
    service.deleteUserBlocks(idBlockerUser, function(err, data) {
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

//DELETE - Deletes all Blocks from db
exports.deleteBlocks = function(req, res) {
    service.deleteBlocks(function(err, data) {
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

