//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

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
                testUtils.cleanUsers(next);
            },
            function (res, next) {
                testUtils.cleanAbuseReports(next);
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

    describe('POST /AbuseReport', () => {
        it('It should save an AbuseReport', (done) => {       
            var criteria = {
                "idReporter": "0",
                "idReported": "1",
                "idCategory": "2",
                "comment": "Imagen chancha"
            };
            testUtils.createAbuseReportByCriteria(criteria, (err, res) => {
                //console.log(res);
                should.not.exist(err);
                res.should.have.status(200);
                
                var data = res.body;
                var abuseReport = data.abuseReport;
                console.log(data);
                expect(abuseReport.idReporter).to.equal('0');
                expect(abuseReport.idReported).to.equal('1');
                expect(abuseReport.idCategory).to.equal(2);
                expect(abuseReport.comment).to.equal("Imagen chancha");
                
                done();
            });
        });
        
        it('It should fail when reporter id is fake', (done) => {
            var criteria = { "idReporter": "XXX", "idReported": "1" };
            testUtils.createAbuseReportByCriteria(criteria, (err, res) => {
                //console.log(res);
                should.exist(err);
                res.should.have.status(404);   
                done();
            });
        });
        
        it('It should fail when reported id is fake', (done) => {
            var criteria = { "idReporter": "0", "idReported": "XXX" };
            testUtils.createAbuseReportByCriteria(criteria, (err, res) => {
                //console.log(res);
                should.exist(err);
                res.should.have.status(404);   
                done();
            });
        });
    });
    
    describe('PUT /AbuseReport', () => {
        it('It should update an AbuseReport', (done) => {
            async.waterfall([
                function (next) {
                    var criteria = {
                        "idReporter": "0",
                        "idReported": "1",
                        "isOpen": "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                var abuseReport = res.body.abuseReport;
                var body = {
                    "abuseReport": {
                        "_id" : abuseReport._id,
                        "idReporter": '0',
                        "idReported": '1',
                        "isOpen": false
                    }
                };
                chai.request(server)
                .put('/AbuseReport')
                .send(body)
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var abuseReport = res.body.abuseReport;
                    expect(res.body.metadata.count).to.equal(1);
                    expect(abuseReport.idReporter).to.equal('0');
                    expect(abuseReport.idReported).to.equal('1');
                    expect(abuseReport.isOpen).to.equal(false);
                    done();
                });
                
            });
        });
        
        it("It should close all the User's AbuseReports", (done) => {
            async.waterfall([
                function (next) {
                    var criteria = {
                        "idReporter": "0",
                        "idReported": "1",
                        "isOpen": "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "2",
                        "idReported": "1",
                        "isOpen": "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "3",
                        "idReported": "0",
                        "isOpen": "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var body = {
                        "abuseReport": {
                            "idUser" : "1",
                        }
                    };
                    chai.request(server)
                    .put('/AbuseReport')
                    .send(body)
                    .end(next);
                },
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                    .get('/AbuseReport/open')
                    .end((err, res) => {
                    
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var reports = data.abuseReports;
                    expect(data.metadata.count).to.equal(1);
                    expect(containsAbuseReport(0, 1, reports)).to.equal(false);
                    expect(containsAbuseReport(2, 1, reports)).to.equal(false);
                    expect(containsAbuseReport(3, 0, reports)).to.equal(true);
                                        
                    done();
                });             
                
            });
        });
    });
    
    return;
    
    describe('GET /AbuseReport', () => {
   
        it('It should get all AbuseReports', (done) => {
            async.waterfall([
                function (next) {
                    var criteria = {
                        "idReporter": "0",
                        "idReported": "1",
                        "isOpen" : "true",
                        "comment": 'cookie'
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "1",
                        "idReported": "2",
                        "isOpen" : "false"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "2",
                        "idReported": "0",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "2",
                        "idReported": "1",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "3",
                        "idReported": "2",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "4",
                        "idReported": "2",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/AbuseReport')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var reports = data.abuseReports;
                    expect(data.metadata.count).to.equal(6);
                    expect(containsAbuseReport(0, 1, reports)).to.equal(true);
                    expect(containsAbuseReport(1, 2, reports)).to.equal(true);
                    expect(containsAbuseReport(2, 0, reports)).to.equal(true);
                    expect(containsAbuseReport(2, 1, reports)).to.equal(true);
                    expect(containsAbuseReport(3, 2, reports)).to.equal(true);
                    expect(containsAbuseReport(4, 2, reports)).to.equal(true);
                    expect(containsAbuseReport(1, 0, reports)).to.equal(false);
                    
                    //test order
                    expect(data.abuseReports[0].idReported).to.equal('2');
                    expect(data.abuseReports[1].idReported).to.equal('2');
                    expect(data.abuseReports[2].idReported).to.equal('2');
                    expect(data.abuseReports[3].idReported).to.equal('1');
                    expect(data.abuseReports[4].idReported).to.equal('1');
                    expect(data.abuseReports[5].idReported).to.equal('0');
                    
                    done();
                });             
            });
        });
        
        it('It should get all open AbuseReports', (done) => {
            async.waterfall([
                function (next) {
                    var criteria = {
                        "idReporter": "0",
                        "idReported": "1",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "1",
                        "idReported": "2",
                        "isOpen" : "false"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "2",
                        "idReported": "0",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "2",
                        "idReported": "1",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/AbuseReport/open')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var reports = data.abuseReports;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsAbuseReport(0, 1, reports)).to.equal(true);
                    expect(containsAbuseReport(1, 2, reports)).to.equal(false);
                    expect(containsAbuseReport(2, 0, reports)).to.equal(true);
                    expect(containsAbuseReport(2, 1, reports)).to.equal(true);
                    expect(containsAbuseReport(1, 0, reports)).to.equal(false);
                    
                    done();
                });             
            });
        });
        
        it('It should get all closed AbuseReports', (done) => {
            async.waterfall([
                function (next) {
                    var criteria = {
                        "idReporter": "0",
                        "idReported": "1",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "1",
                        "idReported": "2",
                        "isOpen" : "false"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "2",
                        "idReported": "0",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = {
                        "idReporter": "2",
                        "idReported": "1",
                        "isOpen" : "true"
                    };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;          
                }
                chai.request(server)
                .get('/AbuseReport/closed')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var reports = data.abuseReports;
                    expect(data.metadata.count).to.equal(1);
                    expect(containsAbuseReport(0, 1, reports)).to.equal(false);
                    expect(containsAbuseReport(1, 2, reports)).to.equal(true);
                    expect(containsAbuseReport(2, 0, reports)).to.equal(false);
                    expect(containsAbuseReport(2, 1, reports)).to.equal(false);
                    expect(containsAbuseReport(1, 0, reports)).to.equal(false);
                    
                    done();
                });             
            });
        });
        
    });
    return;
    describe('DELETE /AbuseReport', () => {
        it('It should delete all AbuseReports', (done) => {
            async.waterfall([
                function (next) {
                    var criteria = { "idReporter": "0", "idReported": "1" };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = { "idReporter": "1", "idReported": "2" };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = { "idReporter": "2", "idReported": "0" };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    var criteria = { "idReporter": "2", "idReported": "1" };
                    testUtils.createAbuseReportByCriteria(criteria, next);
                },
                function (res, next) {
                    chai.request(server)
                        .delete('/AbuseReport')
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
                .get('/AbuseReport')
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

function containsAbuseReport(idReporter, idReported, abuseReports) {
    for (var i = 0; i < abuseReports.length; ++i) {
        if (abuseReports[i].idReporter == idReporter
                && abuseReports[i].idReported == idReported) {
            return true;
        }
    }
    return false;
};

