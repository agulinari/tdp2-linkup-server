//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);
//Our parent block
describe('Link service test', () => {
    beforeEach((done) => { //Before each test
        //start up activities
        done();
    });

    describe('POST /link', () => {
        it('It should save a Link between users to the DB', (done) => {
            var body = {
                "link": {
                    "fbidUser": "100181624056581",        // Juan Perez
                    "fbidCandidate": "114403555967984"    // John Doe
                }
            };

            chai.request(server)
                .post('/link')
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
                "link": {
                    "fbidUser": "100181624056581XXX",     // fake id
                    "fbidCandidate": "114403555967984"    // John Doe
                }
            };
            chai.request(server)
                .post('/link')
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
                "link": {
                    "fbidUser": "100181624056581",          // Juan Perez
                    "fbidCandidate": "114403555967984XXX"    // fake id
                }
            };
            chai.request(server)
                .post('/link')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.exist(err);
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('GET /link/:idUser/:idCandidate', () => {
        it('It should get a Link between users from the DB', (done) => {
            chai.request(server)
                .get('/link/100181624056581/114403555967984')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var link = res.body.link;
                    expect(link.fbidUser).to.equal('100181624056581');
                    expect(link.fbidCandidate).to.equal('114403555967984');
                    done();
                });
        });
    });

    describe('DELETE /link/:idUser/:idCandidate', () => {
        it('It should delete a Link between users from the DB', (done) => {
            chai.request(server)
                .delete('/link/100181624056581/114403555967984')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    //console.log(res.body);
                    done();
                });
        });
    });

    describe('DELETE /link/:idUser', () => {
        it('It should delete all of user\'s Links from the DB', (done) => {
            chai.request(server)
                .delete('/link/100181624056581')
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
