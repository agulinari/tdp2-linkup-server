//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//let mongoose = require("mongoose");
//let Book = require('../app/models/book');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Weather service test', () => {
    beforeEach((done) => { //Before each test
        //start up activities
        done();         
    });

    //Test weather data
    describe('/GET /city/:id', () => {
        it('it should GET the weather data', (done) => {
            chai.request(server)
                .get('/city/3433955')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body.data;
                    data.pressure.should.be.a('number');
                    data.temperature.should.be.a('number');
                    data.weather.should.be.a('string');
                    data.time.should.be.a('string');
                    done();
                });
        });
    });
    
    //Test invalid city
    describe('/GET /city/:fakeid', () => {
        it('it should GET status 404 - City not found', (done) => {
            chai.request(server)
                .get('/city/34339555232999999')
                .end((err, res) => {
                    //console.log(res);
                    should.exist(err);
                    res.should.have.status(404);
                    var data = res.body.data;
                    done();
                });
        });
    });


});
