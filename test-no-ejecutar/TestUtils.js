var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server');
var async = require('async');

chai.use(chaiHttp);

exports.createUserByCriteria = function(c, callback) {
    var body = {
        "user": {
            "birthday": c.birthday == undefined ? "1980/01/01" : c.birthday,
            "comments": "dummy comment",
            "education": "dummy education",
            "fbid": c.id,        
            "firstName": "dummy name",
            "location": c.location == undefined ? {"longitude": "-58.370289",
                                                   "latitude": "-34.603800",
                                                   "name": "Obelisco"}
                                                : c.location,
            "gender": c.gender == undefined ? "male" : c.gender,
            "avatar": {
                "image" : {
                    "idImage": "0",
                    "data": "000000"
                }
             },
            "images": [
                {
                    "image": {
                        "idImage": "1",
                        "data": "123456"
                    }
                },
                 {
                    "image": {
                        "idImage": "2",
                        "data": "222222"
                    }
                }
            ],
            "interests" : [],
            "lastName" : "dummy last name",
            "ocupation" : "dummy ocupation",
            "settings": {
                "fbid": c.id,
                "invisible": c.invisible == undefined ? "false" : c.invisible,
                "maxRange" : "69",
                "maxAge": c.maxAge == undefined ? "99" : c.maxAge,
                "maxDistance" : c.maxDistance == undefined ? "99999"
                                                           : c.maxDistance,
                "minAge": c.minAge == undefined ? "18" : c.minAge,
                "accountType": "Basic",
                "notifications": "true",
                "onlyFriends": c.onlyFriends == undefined ? "true"
                                                          : c.onlyFriends,
                "searchMales": c.searchMales == undefined ? "true"
                                                          : c.searchMales,
                "searchFemales": c.searchFemales == undefined ? "true"
                                                              : c.searchFemales
            },
            "control": {
                "isActive": c.isActive == undefined ? "true" : c.isActive,
                "deactivationTime": c.deactivationTime == undefined
                                        ? null
                                        : c.deactivationTime
            }
        }
    }; 
    
    chai.request(server)
        .post('/user')
        .send(body)
        .end((err, res) => {
            callback(err, res);
        });
}

exports.createAbuseReportByCriteria = function(c, callback) {
    var body = {
        "abuseReport": {
            "_id" : c.id == undefined ? null : c.id,
            "idReporter": c.idReporter,
            "fullnameReporter": "Full Name " + c.idReporter,
            "idReported": c.idReported,
            "fullnameReported": "Full Name " + c.idReported,
            "idCategory": c.idCategory == undefined ? "1" : c.idCategory,
            "comment": c.comment == undefined ? null : c.comment,
            "isOpen": c.isOpen == undefined ? "true" : c.isOpen
        }
    };
 
    chai.request(server)
        .post('/AbuseReport')
        .send(body)
        .end((err, res) => {
            callback(err, res);
        });
}

exports.createBlock = function(idBlockerUser, idBlockedUser, callback) {
    var body = {
        "block": {
            "idBlockerUser": idBlockerUser,
            "idBlockedUser": idBlockedUser
        }
    }; 
 
    chai.request(server)
        .post('/block')
        .send(body)
        .end((err, res) => {
            callback(err, res);
        });
}

exports.cleanDB = function(callback) {
    
    async.waterfall([
        function (next) {
            chai.request(server)
                .get('/clean/user')
                .end((err, res) => {
                    next();
                });
        }
    ],
    function (err, res) {
        if (err) {
            callback(err);
            return;          
        }
        callback(null, res);
    });
}

exports.cleanAbuseReports = function(callback) {
    chai.request(server)
        .get('/clean/AbuseReport')
        .end((err, res) => {
            callback(err, res);
        });
}
