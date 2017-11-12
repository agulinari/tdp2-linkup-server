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
    });

    describe('GET /rejection/:idUser/:idCandidate', () => {
        it('It should get a Rejection between users from the DB', (done) => {
            async.waterfall([
                function (next) {
                    var body = {
                        "rejection": {
                            "fbidUser": "0",
                            "fbidCandidate": "1"
                        }
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
                    console.log('REJECTION: ' + rejection);
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
