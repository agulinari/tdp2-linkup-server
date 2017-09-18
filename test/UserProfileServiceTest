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
describe('UserProfile service test', () => {
    beforeEach((done) => { //Before each test
        //start up activities
        done();         
    });

    // GET /usersProfile
    describe('GET /usersProfile', () => {
        it('it should GET the userProfile from the DB', (done) => {
            chai.request(server)
                .get('/usersProfile')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    /*
                    var data = res.body.data;
                    data.fbId.should.be.a('string');
                    data.Name.should.be.a('string');
                    data.Notifications.should.be.a('number');
                    data.Invisible.should.be.a('number');
                    
                    */
                    done();
                });
        });
    });

    // GET /userProfile
    describe('GET /userProfileById/{id}', () => {
        it('it should GET the UserProfile associated to {id}', (done) => {
            chai.request(server)
                .get('/userProfileById/10214664566027711')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    console.log(data);
                    data.fbid.should.be.a('string');
                    data.firstName.should.be.a('string');
                    data.lastName.should.be.a('string');
                    data.occupation.should.be.a('string');
                    data.education.should.be.a('string');
                    data.comments.should.be.a('string');
                    data.birthday.should.be.a('string');
                    data.gender.should.be.a('string');
                    expect(data.gender).to.be.oneOf(['male', 'female']);
                    data.images[0].should.exist;
                    done();
                });
        });
        
        it('it should GET status 404 when fake {id}', (done) => {
            chai.request(server)
                .get('/userProfileById/xxx')
                .end((err, res) => {
                    //console.log(res);
                    should.exist(err);
                    res.should.have.status(404);
                    done();
                });
        });
    });
    






/*


    //Test UserProfile save
    describe('/POST /profile', () => {
        var profile = 
        it('it should save the UserProfile', (done) => {
            chai.request(server)
                .post('/profile')
                .end((err, res) => {
                    console.log(res);
                    res.should.be.json;
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
*/
});
