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
describe('AbuseReport service test', () => {

    // Before each test
    beforeEach((done) => {
        async.waterfall([
            function (next) {
                testUtils.cleanAds(next);
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

    describe('POST /Ad', () => {
        it('It should save an Ad', (done) => {       
            var criteria = {
                "advertiser": "LinkUp",
                "image": "test12345",
                "url": "https://stackoverflow.com",
                "isActive": true
            };
            testUtils.createAdByCriteria(criteria, (err, res) => {
                //console.log(res);
                should.not.exist(err);
                res.should.have.status(200);
                
                var data = res.body;
                var ad = data.ad;
                expect(ad.advertiser).to.equal(criteria.advertiser);
                expect(ad.image).to.equal(criteria.image);
                expect(ad.url).to.equal(criteria.url);
                expect(ad.isActive).to.equal(criteria.isActive);
                
                done();
            });
        });
        
    });
    
    describe('PUT /Ad', () => {
        it('It should update an Ad', (done) => {
            async.waterfall([
                function (next) {
                    var criteria = {
                        "advertiser": "LinkUp",
                        "image": "test12345",
                        "url": "www.linkup.test.com",
                        "isActive": true
                    };
                    testUtils.createAdByCriteria(criteria, next);
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                var ad = res.body.ad;
                var body = {
                    "ad": {
                        "_id" : ad._id,
                        "advertiser": "LinkUp UPDATED",
                        "image": "test12345 UPDATED",
                        "url": "www.linkup.test.com UPDATED",
                        "isActive": false
                    }
                };
                chai.request(server)
                .put('/Ad')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var ad = res.body.ad;
                    expect(res.body.metadata.count).to.equal(1);
                    expect(ad.advertiser).to.equal(body.ad.advertiser);
                    expect(ad.image).to.equal(body.ad.image);
                    expect(ad.url).to.equal(body.ad.url);
                    expect(ad.isActive).to.equal(body.ad.isActive);
                    done();
                });
                
            });
        });
    });
    
    describe('GET /Ad', () => {
   
        it('It should get all Ads', (done) => {
            async.waterfall([
                function (next) {
                    var criteria = {
                        "advertiser": "ad0"
                    };
                    testUtils.createAdByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "advertiser": "ad1"
                    };
                    testUtils.createAdByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "advertiser": "ad2"
                    };
                    testUtils.createAdByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "advertiser": "ad3"
                    };
                    testUtils.createAdByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "advertiser": "ad4"
                    };
                    testUtils.createAdByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "advertiser": "ad5"
                    };
                    testUtils.createAdByCriteria(criteria, next);
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                    .get('/Ad')
                    .end((err, res) => {
                        //console.log(res);
                        should.not.exist(err);
                        res.should.have.status(200);
                        var data = res.body;
                        var ads = data.ads;
                        expect(data.metadata.count).to.equal(6);
                        expect(containsAd('ad0', ads)).to.equal(true);
                        expect(containsAd('ad1', ads)).to.equal(true);
                        expect(containsAd('ad2', ads)).to.equal(true);
                        expect(containsAd('ad3', ads)).to.equal(true);
                        expect(containsAd('ad4', ads)).to.equal(true);
                        expect(containsAd('ad5', ads)).to.equal(true);
                        expect(containsAd('ad6', ads)).to.equal(false);
                        
                        done();
                });             
            });
        });
    });

    describe('DELETE /Ad', () => {
        it('It should delete all Ads', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createAdByCriteria(null, next);
                },
                function (res, next) {
                    testUtils.createAdByCriteria(null, next);
                },
                function (res, next) {
                    testUtils.createAdByCriteria(null, next);
                },
                function (res, next) {
                    testUtils.createAdByCriteria(null, next);
                },
                function (res, next) {
                    chai.request(server)
                        .delete('/Ad')
                        .end((err, res) => {
                            should.not.exist(err);
                            res.should.have.status(200);
                            next(err, res);
                        });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/Ad')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    expect(data.metadata.count).to.equal(0);
                    done();
                });
                
            });
        });
    });

});

function containsAd(advertiser, ads) {
    for (var i = 0; i < ads.length; ++i) {
        if (ads[i].advertiser == advertiser) {
            return true;
        }
    }
    return false;
};

