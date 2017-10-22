//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server');
var should = chai.should();
var expect = chai.expect;
var async = require('async');
var testUtils = require('./TestUtils');

chai.use(chaiHttp);
//Our parent block
describe('Image service test', () => {

    // Before each test
    beforeEach((done) => {
        // start up activities
        async.waterfall([
            function (next) {
                testUtils.cleanUsers(next);
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
    /*
    describe('DELETE /user', () => {
        it('It should delete all Users', (done) => {
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
    */
    
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
                                "data": "111111"
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
    
    describe('PUT /user', () => {
        it('It should update an User', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createUserByCriteria( {id:"0"}, next);
                },

                function (res, next) {
                    var body = {
                        "user": {
                            "birthday": "1925/01/01",
                            "comments": "Holis",
                            "education": "Analfabeto total",
                            "fbid": "0",        // Agus
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
                                        "idImage": "3",
                                        "data": "3333"
                                    }
                                },
                                {
                                    "image": {
                                        "idImage": "4",
                                        "data": "4444"
                                    }
                                }
                            ],
                            "lastName" : "Linari",
                            "occupation" : "Ciruja",
                            "settings": {
                                "fbid": "0",
                                "invisible": "true",
                                "maxRange" : "99",
                                "maxAge": "99",
                                "maxDistance" : "99",
                                "minAge": "10",
                                "accountType": "Basic",
                                "notifications": "false",
                                "onlyFriends": "false",
                                "searchMales": "false",
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
                            next();
                        });
            }],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/user/0')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);

                    var user = res.body.user;
                    expect(user.fbid).to.equal('0');
                    expect(user.birthday).to.equal("1925/01/01");
                    expect(user.comments).to.equal("Holis");
                    expect(user.education).to.equal("Analfabeto total");
                    expect(user.firstName).to.equal("Agustin");
                    expect(user.lastName).to.equal("Linari");
                    expect(user.occupation).to.equal("Ciruja");
                    expect(user.settings.invisible).to.equal(true);
                    expect(user.settings.maxAge).to.equal(99);
                    expect(user.settings.maxDistance).to.equal(99);
                    expect(user.settings.notifications).to.equal(false);
                    expect(user.settings.onlyFriends).to.equal(false);
                    expect(user.settings.searchMales).to.equal(false);
                    done();
                });
            });
        });
        

    });
    return;
    describe('PUT /user', () => {
        it('It should deactivate an User', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createUserByCriteria( {id:"0"}, next);
                },

                function (res, next) {
                    var body = {
                        "user": {
                            "fbid": "0",        // Agus
                            "control": {
                                "isActive": false,
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
                            next();
                        });

            }],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/user/0')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);

                    var user = res.body.user;
                    expect(user.fbid).to.equal('0');
                    expect(user.control.isActive).to.equal(false);
                    expect(user.control.deactivationDate).to.not.be.a('null');
                    done();
                });
            });
        });

        it('It should set the premium account to an User', (done) => {
            async.waterfall([
                // Create a normal user account
                function (next) {
                    var criteria = {
                        id:"0",
                        isPremium: false
                    }
                    testUtils.createUserByCriteria(criteria, next);
                },
                // Change account to Premium
                function (res, next) {
                    var body = {
                        "user": {
                            "fbid": "0",
                            "control": {
                                "isPremium": true,
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
                            next();
                        });

            }],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/user/0')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);

                    var user = res.body.user;
                    expect(user.fbid).to.equal('0');
                    expect(user.control.isPremium).to.equal(true);
                    done();
                });
            });
        });
        
        it("It should update the User's token", (done) => {
            async.waterfall([
                // Create a normal user account
                function (next) {
                    var criteria = {
                        id:"0",
                        token: '12345'
                    }
                    testUtils.createUserByCriteria(criteria, next);
                },
                // Update token
                function (res, next) {
                    var body = {
                        "user": {
                            "fbid": "0",
                            "control": {
                                "token": 'abcde',
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
                            next();
                        });

            }],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/user/0')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);

                    var user = res.body.user;
                    expect(user.fbid).to.equal('0');
                    expect(user.control.token).to.equal('abcde');
                    done();
                });
            });
        });


    });
/*
    describe('GET /user/:idUser', () => {
        it('It should get an user', (done) => {
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
*/
});
