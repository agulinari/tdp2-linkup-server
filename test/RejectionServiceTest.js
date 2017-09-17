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
describe('Rejection service test', () => {
    beforeEach((done) => { //Before each test
        //start up activities
        done();         
    });

    describe('POST /rejection', () => {
        it('It should save a Rejection between users to the DB', (done) => {
            var body = {
                "rejection": {
                    "fbidUser": "100181624056581",        // Juan Perez
                    "fbidCandidate": "114403555967984"    // John Doe
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
                    "fbidCandidate": "114403555967984"    // John Doe
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
                    "fbidUser": "100181624056581",          // Juan Perez
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
            chai.request(server)
                .get('/rejection/100181624056581/114403555967984')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var rejection = res.body.rejection;
                    expect(rejection.fbidUser).to.equal('100181624056581');
                    expect(rejection.fbidCandidate).to.equal('114403555967984');
                    done();
                });
        });
    });

    describe('DELETE /rejection/:idUser/:idCandidate', () => {
        it('It should delete a Rejection between users from the DB', (done) => {
            chai.request(server)
                .delete('/rejection/100181624056581/114403555967984')
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
                .delete('/rejection/100181624056581')
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
