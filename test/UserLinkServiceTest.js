ss.env.NODE_ENV = 'test';

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
        it('It should save a link between users to the DB', (done) => {
            var body = {
                "link": {
                    "idUser": "100181624056581",        // Juan Perez
                    "idCandidate": "114403555967984"    // John Doe
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
    });
});Module dependencies
