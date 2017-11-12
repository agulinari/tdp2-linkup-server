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
describe('Image service test', () => {

    // Before each test
    beforeEach((done) => {
        // start up activities
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

    describe('POST /image', () => {
        it('It should save an user\'s Image', (done) => {
            var body = {
                "image": {
                    "fbidUser": "0",
                    "idImage": "15",
                    "data": "base64 encoded image..."
                }
            }; 
        
            chai.request(server)
                .post('/image')
                .send(body)
                .end((err, res) => {
                    //console.log(err);
                    should.not.exist(err);
                    res.should.have.status(200);
                    
                    done();
                });
        });
        it('It should fail when idUser is fake', (done) => {
            var body = {
                "image": {
                    "fbidUser": "100181624056581XXX",     // fake id
                    "idImage": "1",
                    "data": "base64 encoded image..."
                }
            }; 
            chai.request(server)
                .post('/image')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.exist(err);
                    res.should.have.status(404);   
                    done();
                });
        });
    });

    describe('GET /image/:idUser/:idCandidate', () => {
        it('It should get an user\'s Image', (done) => {
            chai.request(server)
                .get('/image/0/1')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var image = res.body.image;
                    expect(image.fbidUser).to.equal('0');
                    expect(image.idImage).to.equal('1');
                    image.should.have.property('data');
                    done();
                });
        });
    });

    describe('DELETE /image/:idUser/:idCandidate', () => {
        it('It should delete an user\'s Image', (done) => {
            chai.request(server)
                .delete('/image/0/1')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    //console.log(res.body);
                    done();
                });
        });
    });
    
    describe('DELETE /image/:idUser', () => {
        it('It should delete all of user\'s Images', (done) => {
            chai.request(server)
                .delete('/image/0')
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
