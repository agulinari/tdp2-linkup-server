//During the test the env variable is set to test
process.env.NODE_ENV = 'TEST';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server');
var should = chai.should();
var expect = chai.expect;
var testUtils = require('./TestUtils');
var async = require('async');

chai.use(chaiHttp);
//Our parent block
describe('Rejection service test', () => {
    beforeEach((done) => { //Before each test
        async.waterfall([
            function (next) {
                testUtils.cleanUsers(next);
            },
            function (res, next) {
                testUtils.cleanRecommendations(next);
            },
            function (res, next) {
                testUtils.createUserByCriteria( {id:"0"}, next);
            },
            function (res, next) {
                testUtils.createUserByCriteria( {id:"1"}, next);
            },
            function (res, next) {
                testUtils.createUserByCriteria( {id:"2"}, next);
            },
            function (res, next) {
                testUtils.createUserByCriteria( {id:"3"}, next);
            },
            function (res, next) {
                testUtils.createUserByCriteria( {id:"4"}, next);
            }
        ],
        function (err, res) {
            if (err) {
                done(err);
                return;          
            }
            done();
        });         
    });

    describe('POST /rejection', () => {
        it('It should save a Rejection between users to the DB', (done) => {
            var body = {
                "rejection": {
                    "fbidUser": "0",
                    "fbidCandidate": "1"
                }
            }; 
        
            chai.request(server)
                .post('/rejection')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    
                    done();
                });
        });
        
        it('It should fail when idUser is fake', (done) => {
            var body = {
                "rejection": {
                    "fbidUser": "100181624056581XXX",     // fake id
                    "fbidCandidate": "0"
                }
            }; 
            chai.request(server)
                .post('/rejection')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.exist(err);
                    res.should.have.status(404);   
                    done();
                });
        });
        
        it('It should fail when idCandidate is fake', (done) => {
            var body = {
                "rejection": {
                    "fbidUser": "0",
                    "fbidCandidate": "114403555967984XXX"    // fake id
                }
            }; 
            chai.request(server)
                .post('/rejection')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.exist(err);
                    res.should.have.status(404);   
                    done();
                });
        });
        
        it('It should remove blocked user recomendations from blocker user',
                (done) => {
           
            async.waterfall([
                function (next) {
                    var c = {
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "2"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "2",
                        "idToUser": "1",
                        "idRecommendedUser": "0"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "3",
                        "idToUser": "1",
                        "idRecommendedUser": "0"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "4",
                        "idToUser": "1",
                        "idRecommendedUser": "0"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                     var body = {
                        "rejection": { "fbidUser": "1", "fbidCandidate": "0" }
                    }; 
                
                    chai.request(server)
                        .post('/rejection')
                        .send(body)
                        .end((err, res) => {
                            //console.log(res);
                            should.not.exist(err);
                            res.should.have.status(200);
                            
                            next();
                        });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                
                chai.request(server)
                    .get('/recommendation/1')
                    .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var rs = data.recommendations;
                    expect(data.metadata.count).to.equal(2);
                    expect(containsRecommendation(0, 1, 2, rs)).to.equal(true);
                    expect(containsRecommendation(2, 1, 0, rs)).to.equal(false);
                    expect(containsRecommendation(3, 1, 0, rs)).to.equal(false);
                    expect(containsRecommendation(4, 1, 0, rs)).to.equal(false);
                    expect(containsRecommendation(0, 1, 3, rs)).to.equal(true);

                    done();
                });
            });
        });
    });

    describe('GET /rejection/:idUser/:idCandidate', () => {
        it('It should get a Rejection between users from the DB', (done) => {
            async.waterfall([
                function (next) {
                    var body = {
                        "rejection": { "fbidUser": "0", "fbidCandidate": "1" }
                    }; 
                
                    chai.request(server)
                        .post('/rejection')
                        .send(body)
                        .end(next);
                }
            ],
            function (err, res) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/rejection/0/1')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var rejection = res.body.rejection;
                    expect(rejection.fbidUser).to.equal('0');
                    expect(rejection.fbidCandidate).to.equal('1');
                    done();
                });
            });   
            
        });
    });

    describe('DELETE /rejection/:idUser/:idCandidate', () => {
        it('It should delete a Rejection between users from the DB', (done) => {
            chai.request(server)
                .delete('/rejection/0/1')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    //console.log(res.body);
                    done();
                });
        });
    });
    
    describe('DELETE /rejection/:idUser', () => {
        it('It should delete all of user\'s Rejections from the DB', (done) => {
            chai.request(server)
                .delete('/rejection/0')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    //console.log(res.body);
                    done();
                });
        });
    });

});

function containsRecommendation(idFromUser,
                                idToUser,
                                idRecommendedUser,
                                recommendations) {
    for (var i = 0; i < recommendations.length; ++i) {
        if (recommendations[i].idFromUser == idFromUser
                && recommendations[i].idToUser == idToUser
                && recommendations[i].idRecommendedUser == idRecommendedUser) {
            return true;
        }
    }
    return false;
};

