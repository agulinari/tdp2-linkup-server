var async = require('async');
var userDao = require('../dao/UserDao');
var blockDao = require('../dao/BlockDao');
var linkService = require('../service/LinkService');
var matchService = require('../service/MatchService');
var utils = require('../utils/Utils');
var BlockError = require("../error/BlockError");
var NotFound = require("../error/NotFound");

/**
 * Get Block
 * @param {String} idBlockerUser
 * @param {String} idBlockedUser
 * @param {Function} callback
 */
exports.getBlock = function (idBlockerUser, idBlockedUser, callback) {
    blockDao.findBlock(idBlockerUser, idBlockedUser, (err, block) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, block);
    });
};

/**
 * Get User's Blocks
 * @param {String} idBlockerUser
 * @param {Function} callback
 */
exports.getUserBlocks = function (idBlockerUser, callback) {
    blockDao.findUserBlocks(idBlockerUser, (err, blocks) => {
        if (err) {
            callback(err, null);
            return;
        }        
        callback(null, blocks);
    });
};

/**
 * Get Blocks to the user by users
 * @param {String} idBlockerUser
 * @param {Function} callback
 */
exports.getUsersBlockingUser = function (idBlockedUser, callback) {
    blockDao.findWhoBlockedUser(idBlockedUser, function (err, blocks) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, blocks);
    });
};

/**
 * Get Blocks
 * @param {Function} callback
 */
exports.getBlocks = function (callback) {
    blockDao.findBlocks(function (err, blocks) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, blocks);
    });
};

/**
 * Save Block
 * @param {String} idBlockerUser
 * @param {String} fbidBlocked
 * @param {Function} callback
 */
exports.saveBlock = function (idBlockerUser, idBlockedUser, callback) {
    var candidate = {};
    var block = {};
    async.waterfall([
        function getBlockerUser(next) {
            userDao.findUser(idBlockerUser, (err, user) => {
                if (err) {
                    next(err);
                    return;
                }
                if (user == null) {
		            next(new NotFound("No se encontro el usuario"));
                    return;
                }
                next();
            });
        },
        function getBlockedUser(next) {
           userDao.findUser(idBlockedUser, (err, user) => {
                if (err) {
                    next(err);
                    return;
                }
                if (user == null) {
		            next(new NotFound("No se encontro el usuario blockeado"));
                    return;
                }
                next();
            });
        },
        function save(next) {
            blockDao.saveBlock(idBlockerUser, idBlockedUser, (err, block) => {
                if (err) {
                    next(err);
                    return;
                }
                next(null, block);
            });
        },
        function deleteBlockerUserLink(block, next) {
            linkService.deleteLink(idBlockerUser, idBlockedUser, (err, d) => {
                if (err) {
                    next(err);
                    return;
                }
                next(null, block);
            });
        },
        function deleteBlockedUserLink(block, next) {
            linkService.deleteLink(idBlockedUser, idBlockerUser, (err, d) => {
                if (err) {
                    next(err);
                    return;
                }
                next(null, block);
            });
        },
        function deleteMatchs(block, next) {
            matchService.deleteMatch(idBlockedUser, idBlockerUser, (err, d) => {
                if (err) {
                    next(err);
                    return;
                }
                next(null, block);
            });
        }
    ],
    function (err, block) {
        if (err) {
            callback(err);
            return;
        }
        console.log(JSON.stringify(block));
        callback(null, block);
    });
};

/**
 * Delete Block
 * @param {String} idBlockerUser
 * @param {String} idBlockedUser
 * @param {Function} callback
 */
exports.deleteBlock = function (idBlockerUser, idBlockedUser, callback) {
    blockDao.deleteBlock(idBlockerUser, idBlockedUser, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

/**
 * Delete all user's Blocks
 * @param {String} idBlockerUser
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteUserBlocks = function (idBlockerUser, callback) {
    blockDao.deleteUserBlocks(idBlockerUser, function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

/**
 * Delete all Blocks
 * @param {Function} callback  The function to call when deletion is complete.
 */
exports.deleteBlocks = function (callback) {
    blockDao.deleteBlocks(function (err, data) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, data);
    });
};

