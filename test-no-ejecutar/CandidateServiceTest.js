//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server');
var should = chai.should();
var expect = chai.expect;
var async = require('async');

chai.use(chaiHttp);
//Our parent block
describe('Candidate service test', () => {

    // Before each test
    beforeEach((done) => {
    
        chai.request(server)
                .delete('/user')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    
                    chai.request(server)
                        .delete('/rejection')
                        .end((err, res) => {
                            //console.log(res);
                            should.not.exist(err);
                            res.should.have.status(200);
                            //console.log(res.body);
                            done();
                    });

                });
    });
    
    describe('GET /candidate/:idUser', () => {
        it('It should get all user\'s Candidates', (done) => {
            async.waterfall([
                function (next) {
                    createUserByCriteria( {id:"0"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"1"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"2"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"3"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"4"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"5"}, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(5);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(true);
                    expect(containsCandidate(4, candidates)).to.equal(true);
                    expect(containsCandidate(5, candidates)).to.equal(true);
                    
                    done();
                });
            });
        });
    });
    
    describe('GET /candidate/:idUser', () => {
        it('It should filter far away user\'s Candidates', (done) => {
            async.waterfall([
                function (next) {
                    createUserByCriteria( {id:"0", maxDistance: "1"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"1"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"2"}, next);
                },
                
                function (err, next) {
                     var loc= {
                        longitude: "2.294694",
                        latitude: "48.858093",
                        name: "eiffel tower"
                    }
                    createUserByCriteria( {id:"3", location: loc}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"4"}, next);
                },
                function (err, next) {
                    var loc = {
                        longitude: "2.294694",
                        latitude: "48.858093",
                        name: "eiffel tower"
                    }
                    createUserByCriteria( {id:"5", location: loc}, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(false);
                    expect(containsCandidate(4, candidates)).to.equal(true);
                    expect(containsCandidate(5, candidates)).to.equal(false);
                    
                    done();
                });
            });
        });
    });
    
    describe('GET /candidate/:idUser', () => {
        it('It should filter only friends Candidates', (done) => {
            async.waterfall([
                function (next) {
                    createUserByCriteria( {id:"0", onlyFriends: "false"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"1", onlyFriends: "false"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"2", onlyFriends: "false"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"3", onlyFriends: "true"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"4", onlyFriends: "false"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"5", onlyFriends: "true"}, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(false);
                    expect(containsCandidate(4, candidates)).to.equal(true);
                    expect(containsCandidate(5, candidates)).to.equal(false);
                    
                    done();
                });
            });
        });
    });
    
    describe('GET /candidate/:idUser', () => {
        it('It should filter more than Friends Candidates', (done) => {
            async.waterfall([
                function (next) {
                    createUserByCriteria( {id:"0", onlyFriends: "true"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"1", onlyFriends: "true"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"2", onlyFriends: "true"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"3", onlyFriends: "false"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"4", onlyFriends: "true"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"5", onlyFriends: "false"}, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(false);
                    expect(containsCandidate(4, candidates)).to.equal(true);
                    expect(containsCandidate(5, candidates)).to.equal(false);
                    
                    done();
                });
            });
        });
    });

    describe('GET /candidate/:idUser', () => {
        it('It should filter male Candidates', (done) => {
            async.waterfall([
                function (next) {
                    createUserByCriteria( {id:"0", searchMales: "false"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"1", gender: "female"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"2", gender: "female"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"3", gender: "male"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"4", gender: "female"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"5", gender: "male"}, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(false);
                    expect(containsCandidate(4, candidates)).to.equal(true);
                    expect(containsCandidate(5, candidates)).to.equal(false);
                    
                    done();
                });
            });
        });
    });
    
    describe('GET /candidate/:idUser', () => {
        it('It should filter female Candidates', (done) => {
            async.waterfall([
                function (next) {
                    createUserByCriteria({id:"0", searchFemales: "false"},
                                         next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"1", gender: "female"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"2", gender: "female"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"3", gender: "male"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"4", gender: "female"}, next);
                },
                function (err, next) {
                    createUserByCriteria( {id:"5", gender: "male"}, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(2);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(false);
                    expect(containsCandidate(2, candidates)).to.equal(false);
                    expect(containsCandidate(3, candidates)).to.equal(true);
                    expect(containsCandidate(4, candidates)).to.equal(false);
                    expect(containsCandidate(5, candidates)).to.equal(true);
                    
                    done();
                });
            });
        });
    });

    describe('GET /candidate/:idUser', () => {
        it('It should filter younger than preferred Candidates', (done) => {

            var now = new Date();
       
            async.waterfall([
                function (next) {
                    var c = {id:"0", minAge: "20", birthday: "1980/01/02"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 19 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate();
                    var c = {id:"1", birthday: bday};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 20 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate();
                    var c = {id:"2", birthday: bday};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 21 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate();
                    var c = {id:"3", birthday: bday};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 20 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate() + 1;
                    var c = {id:"4", birthday: bday};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 20 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate() - 1;
                    var c = {id:"5", birthday: "1997/01/03"};
                    createUserByCriteria(c, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(3);                    
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(false);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(true);
                    expect(containsCandidate(4, candidates)).to.equal(false);
                    expect(containsCandidate(5, candidates)).to.equal(true);
                    
                    done();
                });
            });
        });
    });

    describe('GET /candidate/:idUser', () => {
        it('It should filter older than preferred Candidates', (done) => {

            var now = new Date();
       
            async.waterfall([
                function (next) {
                    var c = {id:"0", maxAge: "40", birthday: "1980/01/02"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 41 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate();
                    var c = {id:"1", birthday: bday};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 40 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate();
                    var c = {id:"2", birthday: bday};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 39 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate();
                    var c = {id:"3", birthday: bday};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 40 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate() - 1;
                    var c = {id:"4", birthday: bday};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var bday = now.getFullYear() - 40 + '/'
                        + (now.getMonth() < 10 ? '0' : '')
                        + (now.getMonth() + 1) + '/'
                        + (now.getDate() < 10 ? '0' : '') + now.getDate() + 1;
                    var c = {id:"5", birthday: "1997/01/03"};
                    createUserByCriteria(c, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(false);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(true);
                    expect(containsCandidate(4, candidates)).to.equal(false);
                    expect(containsCandidate(5, candidates)).to.equal(true);
                    
                    done();
                });
            });
        });
    });

    describe('GET /candidate/:idUser', () => {
        it('It should filter invisible Candidates', (done) => {       
            async.waterfall([
                function (next) {
                    var c = {id:"0"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"1", invisible: 'false'};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"2", invisible: 'false'};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"3", invisible: 'true'};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"4", invisible: 'true'};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"5", invisible: "true"};
                    createUserByCriteria(c, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(2);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(false);
                    expect(containsCandidate(4, candidates)).to.equal(false);
                    expect(containsCandidate(5, candidates)).to.equal(false);
                    
                    done();
                });
            });
        });
    });
    
    describe('GET /candidate/:idUser', () => {
        it('It should filter when the user is not compatible', (done) => {       
            async.waterfall([
                function (next) {
                    var c = {id:"0"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"1"};
                    createUserByCriteria(c, next);
                },
                
                function (err, next) {
                    var c = {id:"2", maxAge: '18'};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"3", minAge: '90'};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"4", maxDistance: '1', searchMales: 'false'};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"5", onlyFriends: 'false'};
                    createUserByCriteria(c, next);
                }
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(1);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(false);
                    expect(containsCandidate(3, candidates)).to.equal(false);
                    expect(containsCandidate(4, candidates)).to.equal(false);
                    expect(containsCandidate(5, candidates)).to.equal(false);
                    
                    done();
                });
            });
        });
    });
    
    describe('GET /candidate/:idUser', () => {
        it('It should filter rejected Candidates', (done) => {       
            async.waterfall([
                function (next) {
                    var c = {id:"0"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"1"};
                    createUserByCriteria(c, next);
                },
                
                function (err, next) {
                    var c = {id:"2"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"3"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"4"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"5"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var body = {
                        "rejection": {
                            "fbidUser": "0",
                            "fbidCandidate": "3"
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
                },
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(4);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(false);
                    expect(containsCandidate(4, candidates)).to.equal(true);
                    expect(containsCandidate(5, candidates)).to.equal(true);
                    
                    done();
                });
            });
        });
    });

    describe('GET /candidate/:idUser', () => {
        it('It should filter Candidates that rejected the user', (done) => {       
            async.waterfall([
                function (next) {
                    var c = {id:"0"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"1"};
                    createUserByCriteria(c, next);
                },
                
                function (err, next) {
                    var c = {id:"2"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"3"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"4"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var c = {id:"5"};
                    createUserByCriteria(c, next);
                },
                function (err, next) {
                    var body = {
                        "rejection": {
                            "fbidUser": "4",
                            "fbidCandidate": "0"
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
                },
            ],
            function (err, user) {
                should.not.exist(err);
                
                chai.request(server)
                .get('/candidate/0')
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var candidates = data.candidates;
                    expect(data.metadata.count).to.equal(4);
                    expect(containsCandidate(0, candidates)).to.equal(false);
                    expect(containsCandidate(1, candidates)).to.equal(true);
                    expect(containsCandidate(2, candidates)).to.equal(true);
                    expect(containsCandidate(3, candidates)).to.equal(true);
                    expect(containsCandidate(4, candidates)).to.equal(false);
                    expect(containsCandidate(5, candidates)).to.equal(true);
                    
                    done();
                });
            });
        });
    });


});

function containsCandidate(fbid, candidates) {
    for (var i = 0; i < candidates.length; ++i) {
        if (candidates[i].fbid == fbid) {
            return true;
        }
    }
    return false;
}

function createUserByCriteria(c, callback) {
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

