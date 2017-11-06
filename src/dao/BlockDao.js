'use strict';

var Block = require('../model/Block');
var NotFound = require("../error/NotFound");
var BlockError = require("../error/BlockError");
var BadRequest = require("../error/BadRequest");

/**
 * Retrieves a Block
 * @param {String} idBlockerUser blocker User facebook ID.
 * @param {String} idBlockedUser blocked User facebook ID.
 * @param {Function} callback
 **/
exports.findBlock = function(idBlockerUser, idBlockedUser, callback) {
    var query = {
        "idBlockerUser": idBlockerUser,
        "idBlockedUser": idBlockedUser
    };
    var proj = "-__v";
    Block.findOne(query, proj, (err, value) => {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves user's Blocks
 * @param {String} idBlockerUser User facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findUserBlocks = function(idBlockerUser, callback) {
    var query = {
        "idBlockerUser": idBlockerUser,
    };
    var proj = "-__v";
    Block.find(query, proj, (err, value) => {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves Blocks to the user by another users
 * @param {String} idBlockerUser User facebook ID.
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findWhoBlockedUser = function(idBlockedUser, callback) {
    var query = {
        "idBlockedUser": idBlockedUser,
    };
    var proj = "-__v";
    Block.find(query, proj, (err, value) => {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Retrieves Blocks
 * @param {Function} callback The function to call when retrieval is complete.
 **/
exports.findBlocks = function(callback) {
    var proj = "-__v";
    Block.find(null, proj, (err, value) => {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

exports.saveBlock = function(idBlockerUser, idBlockedUser, callback) {
    var newBlock = new Block();
    newBlock.idBlockerUser = idBlockerUser;
    newBlock.idBlockedUser = idBlockedUser;
    exports.findBlock(idBlockerUser, idBlockedUser, (err, block) => {
        if (err) {
            callback(err, null);
            return;
        }
        if (block != null) {
            var msg = "User " + idBlockerUser
                      + ' already blocked ' + idBlockedUser;
            callback(new BlockError(msg), null);
            return;
        }
        newBlock.save((err, value) => {
            if (err) {
                callback(err,null);
                return;
            }
            callback(null, value);
        });
    });
};

/**
 * Deletes a Block
 * @param {String} idBlockerUser User facebook ID.
 * @param {String} idBlockedUser Candidate facebook ID.
 * @param {Function} callback
 **/
exports.deleteBlock = function(idBlockerUser, idBlockedUser, callback) {
    var query = {
        "idBlockerUser": idBlockerUser,
        "idBlockedUser": idBlockedUser
    };
    Block.deleteMany(query, (err, value) => {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all user's Blocks
 * @param {String} idBlockerUser User facebook ID.
 * @param {Function} callback
 **/
exports.deleteUserBlocks = function(idBlockerUser, callback) {
    var query = {
        "idBlockerUser": idBlockerUser,
    };
    Block.deleteMany(query, (err, value) => {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

/**
 * Deletes all Blocks
 * @param {String} idBlockerUser User facebook ID.
 * @param {Function} callback The function to call when deletion is complete.
 **/
exports.deleteBlocks = function(callback) {
    Block.deleteMany((err, value) => {
        if (err) {
            callback(err,null);
            return;
        }
        callback(null, value);
    });
};

