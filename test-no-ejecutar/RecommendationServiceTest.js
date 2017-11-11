//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

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
describe('Recommendation service test', () => {

    // Before each test
    beforeEach((done) => {
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

    describe('POST /Recommendation', () => {
        it('It should save a Recommendation', (done) => {       
            var c = {
                "idFromUser": "0",
                "idToUser": "1",
                "idRecommendedUser": "2"
            };
            testUtils.createRecommendationByCriteria(c, (err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                
                var data = res.body;
                var r = data.recommendation;
                expect(r.idFromUser).to.equal(c.idFromUser);
                expect(r.idToUser).to.equal(c.idToUser);
                expect(r.idRecommendedUser).to.equal(c.idRecommendedUser);
                
                done();
            });
        });
        
        it('It should fail when recommender id is fake', (done) => {
            var c = {
                "idFromUser": "XXX",
                "idToUser": "1",
                "idRecommendedUser": "2"
            };
            testUtils.createRecommendationByCriteria(c, (err, res) => {
                //console.log(res);
                should.exist(err);
                res.should.have.status(404);   
                done();
            });
        });
        
        it('It should fail when target user id is fake', (done) => {
            var c = {
                "idFromUser": "0",
                "idToUser": "XXX",
                "idRecommendedUser": "2"
            };
            testUtils.createRecommendationByCriteria(c, (err, res) => {
                //console.log(res);
                should.exist(err);
                res.should.have.status(404);   
                done();
            });
        });
        
        it('It should fail when recommended user id is fake', (done) => {
            var c = {
                "idFromUser": "0",
                "idToUser": "1",
                "idRecommendedUser": "XXX"
            };
            testUtils.createRecommendationByCriteria(c, (err, res) => {
                //console.log(res);
                should.exist(err);
                res.should.have.status(404);   
                done();
            });
        });
    });
    
    describe('GET /Recommendation', () => {
   
        it('It should get all Recommendations', (done) => {
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
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "4"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "2",
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "2",
                        "idRecommendedUser": "4"
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
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/Recommendation')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var rs = data.recommendations;
                    expect(data.metadata.count).to.equal(6);
                    expect(containsRecommendation(0, 1, 2, rs)).to.equal(true);
                    expect(containsRecommendation(0, 1, 3, rs)).to.equal(true);
                    expect(containsRecommendation(0, 1, 4, rs)).to.equal(true);
                    expect(containsRecommendation(1, 2, 3, rs)).to.equal(true);
                    expect(containsRecommendation(1, 2, 4, rs)).to.equal(true);
                    expect(containsRecommendation(2, 1, 0, rs)).to.equal(true);
                    expect(containsRecommendation(0, 1, 0, rs)).to.equal(false);
                    
                    done();
                });             
            });
        });
        
        it('It should get all Recommendations to User', (done) => {
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
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "4"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "2",
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "3",
                        "idRecommendedUser": "4"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "2",
                        "idToUser": "0",
                        "idRecommendedUser": "1"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/Recommendation/1')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var rs = data.recommendations;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsRecommendation(0, 1, 2, rs)).to.equal(true);
                    expect(containsRecommendation(2, 1, 3, rs)).to.equal(true);
                    expect(containsRecommendation(0, 1, 4, rs)).to.equal(true);
                    expect(containsRecommendation(1, 2, 3, rs)).to.equal(false);
                    expect(containsRecommendation(1, 3, 4, rs)).to.equal(false);
                    expect(containsRecommendation(2, 0, 1, rs)).to.equal(false);
                    
                    done();
                });             
            });
        });
        
    });
    
    describe('DELETE /Recommendation', () => {
        it('It should delete all Recommendations', (done) => {
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
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "4"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "2",
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "2",
                        "idRecommendedUser": "4"
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
                    chai.request(server)
                        .delete('/Recommendation')
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            next(err, res);
                        });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/Recommendation')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    expect(data.metadata.count).to.equal(0);
                    done();
                });
                
            });
        });
    });

    describe('DELETE /Recommendations', () => {
        it('It should delete all Recommendations to User', (done) => {
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
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "4"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "2",
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "3",
                        "idRecommendedUser": "4"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "2",
                        "idToUser": "0",
                        "idRecommendedUser": "1"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    chai.request(server)
                        .delete('/Recommendation/1')
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            next(err, res);
                        });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/Recommendation')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var rs = data.recommendations;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsRecommendation(0, 1, 2, rs)).to.equal(false);
                    expect(containsRecommendation(2, 1, 3, rs)).to.equal(false);
                    expect(containsRecommendation(0, 1, 4, rs)).to.equal(false);
                    expect(containsRecommendation(1, 2, 3, rs)).to.equal(true);
                    expect(containsRecommendation(1, 3, 4, rs)).to.equal(true);
                    expect(containsRecommendation(2, 0, 1, rs)).to.equal(true);
                    done();
                });
                
            });
        });
    });

    describe('DELETE /Recommendations', () => {
        it('It should delete all User Recommendations to User', (done) => {
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
                        "idFromUser": "3",
                        "idToUser": "1",
                        "idRecommendedUser": "2"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "0",
                        "idToUser": "1",
                        "idRecommendedUser": "4"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "2",
                        "idRecommendedUser": "3"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "1",
                        "idToUser": "3",
                        "idRecommendedUser": "4"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    var c = {
                        "idFromUser": "2",
                        "idToUser": "0",
                        "idRecommendedUser": "1"
                    };
                    testUtils.createRecommendationByCriteria(c, next);
                },
                function (res, next) {
                    chai.request(server)
                        .delete('/Recommendation/1/2')
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            next(err, res);
                        });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/Recommendation')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var rs = data.recommendations;
                    expect(data.metadata.count).to.equal(4);
                    expect(containsRecommendation(0, 1, 2, rs)).to.equal(false);
                    expect(containsRecommendation(3, 1, 2, rs)).to.equal(false);
                    expect(containsRecommendation(0, 1, 4, rs)).to.equal(true);
                    expect(containsRecommendation(1, 2, 3, rs)).to.equal(true);
                    expect(containsRecommendation(1, 3, 4, rs)).to.equal(true);
                    expect(containsRecommendation(2, 0, 1, rs)).to.equal(true);
                    done();
                });
                
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

