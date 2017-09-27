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
describe('Image service test', () => {

    // Before each test
    beforeEach((done) => {
        // start up activities
        done();         
    });
    
    describe('DELETE /user/:idUser', () => {
        it('It should delete a User', (done) => {
            chai.request(server)
                .delete('/user')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    //console.log(res.body);
                    done();
                });
        });
    });
    return;

    describe('POST /user', () => {
        it('It should save an User', (done) => {
            var body = {
                "user": {
                    "birthday": "1983/04/01",
                    "comments": "Soy un trolo barbaro",
                    "education": "Analfabeto total",
                    "fbid": "10214664566027713",        // Agus
                    "firstName": "Agustin",
                    "location": {
                        "longitude": "23",
                        "latitude": "33",
                        "name": "Disney"
                    },
                    "gender": "male",
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
                    "lastName" : "Linari",
                    "ocupation" : "Catador de glandes",
                    "settings": {
                        "fbid": "10214664566027713",
                        "invisible": "false",
                        "maxRange" : "69",
                        "maxAge": "45",
                        "maxDistance" : "68",
                        "minAge": "18",
                        "accountType": "Basic",
                        "notifications": "true",
                        "onlyFriends": "true",
                        "searchMales": "true",
                        "searchFemales": "true"
                    }
                }
            }; 
        
            chai.request(server)
                .post('/user')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });
    });
    return;
    
    
    describe('PUT /user', () => {
        it('It should update an User', (done) => {
            var body = {
                "user": {
                    "birthday": "1983/04/01",
                    "comments": "Soy un trolo barbaro (UPDATED)",
                    "education": "Analfabeto total (UPDATED)",
                    "fbid": "10214664566027713",        // Agus
                    "firstName": "Agustin (UPDATED)",
                    "location": {
                        "longitude": "23",
                        "latitude": "99",
                        "name": "Eiffel Tower"
                    },
                    "gender": "male",
                    "avatar": {
                        "image" : {
                            "idImage": "1",
                            "data": "123456"
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
                    "lastName" : "Linari (UPDATED)",
                    "ocupation" : "Catador de glandes (UPDATED)",
                    "settings": {
                        "fbid": "10214664566027713",
                        "invisible": "false",
                        "maxRange" : "69",
                        "maxAge": "45",
                        "maxDistance" : "99",
                        "minAge": "20",
                        "accountType": "Basic",
                        "notifications": "true",
                        "onlyFriends": "true",
                        "searchMales": "true",
                        "searchFemales": "true"
                    }
                }
            }; 
        
            chai.request(server)
                .put('/user')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });
    });
    
    describe('GET /user/:idUser', () => {
        it('It should get an user\'s Image', (done) => {
            chai.request(server)
                .get('/user/10214664566027713')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var user = res.body.user;
                    expect(user.fbid).to.equal('10214664566027713');
                    done();
                });
        });
    });

});
