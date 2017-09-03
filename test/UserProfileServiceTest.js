//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('UserProfile service test', () => {
    beforeEach((done) => { //Before each test
        //start up activities
        done();         
    });

    //Test userProfile data
    describe('/GET /userProfile/:id', () => {
        it('it should GET the userProfile data', (done) => {
            chai.request(server)
                .get('/userProfile/3433955')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body.data;
                    data.fbId.should.be.a('string');
                    data.Name.should.be.a('string');
                    data.Notifications.should.be.a('number');
                    data.Invisible.should.be.a('number');
                    done();
                });
        });
    });
    
    //Test invalid userProfile
    describe('/GET /userProfile/:fakeid', () => {
        it('it should GET status 404 - UserProfile not found', (done) => {
            chai.request(server)
                .get('/userProfile/34339555232999999')
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
