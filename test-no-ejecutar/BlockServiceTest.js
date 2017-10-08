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
describe('Block service test', () => {
    beforeEach((done) => { //Before each test
        async.waterfall([
            function (next) {
                testUtils.cleanDB(next);
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
            },
            function (res, next) {
                testUtils.createUserByCriteria( {id:"5"}, next);
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

    describe('POST /block', () => {
        it('It should save a Block between users to the DB', (done) => {
            testUtils.createBlock("0", "1", (err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                done();
            });
        });

        it('It should fail when idBlockerUser is fake', (done) => {
            testUtils.createBlock("XXX", "1", (err, res) => {
                should.exist(err);
                res.should.have.status(404);
                done();
            });
        });

        it('It should fail when idBlockedUser is fake', (done) => {
            testUtils.createBlock("0", "XXX", (err, res) => {
                should.exist(err);
                res.should.have.status(404);
                done();
            });
        });
    });

    describe('GET /block/:idBlockerUser/:idBlockedUser', () => {
        it('It should get a Block between users from the DB', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createBlock("0", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/block/0/1')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var block = data.block;
                    expect(data.metadata.count).to.equal(1);
                    expect(block.idBlockerUser).to.equal("0");
                    expect(block.idBlockedUser).to.equal("1");
                    expect(block.time).not.to.be.a("null");
                    done();
                });
            });
        });
    });

    describe('GET /block/:idBlockerUser', () => {
        it('It should get all Blocks from an User', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createBlock("0", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("1", "0", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("0", "3", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("0", "5", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("2", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("3", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/block/0')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var blocks = data.blocks;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsBlock(0, 1, blocks)).to.equal(true);
                    expect(containsBlock(0, 3, blocks)).to.equal(true);
                    expect(containsBlock(0, 5, blocks)).to.equal(true);
                    expect(containsBlock(2, 1, blocks)).to.equal(false);

                    done();
                });
            });
        });
    });

    describe('GET /block', () => {
        it('It should get all Blocks', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createBlock("0", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("1", "0", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("0", "3", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("0", "5", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("2", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("3", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/block')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var blocks = data.blocks;
                    expect(data.metadata.count).to.equal(6);
                    expect(containsBlock(0, 1, blocks)).to.equal(true);
                    expect(containsBlock(0, 3, blocks)).to.equal(true);
                    expect(containsBlock(0, 5, blocks)).to.equal(true);
                    expect(containsBlock(1, 0, blocks)).to.equal(true);
                    expect(containsBlock(2, 1, blocks)).to.equal(true);
                    expect(containsBlock(3, 1, blocks)).to.equal(true);

                    done();
                });
            });
        });
    });

    describe('DELETE /block/:idBlockerUser/:idBlockedUser', () => {
        it('It should delete a Block between users', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createBlock("0", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    chai.request(server)
                    .delete('/block/0/1')
                    .end((err, res) => {
                        //console.log(res);
                        should.not.exist(err);
                        res.should.have.status(200);
                        //console.log(res.body);
                        next();
                    });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/block/0/1')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var block = data.block;
                    expect(data.metadata.count).to.equal(0);
                    done();
                });
            });
        });
    });

    describe('DELETE /block/:idBlockerUser', () => {
        it('It should delete all of user\'s Blocks', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createBlock("0", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("1", "0", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("0", "3", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("0", "5", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("2", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("3", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    chai.request(server)
                    .delete('/block/0')
                    .end((err, res) => {
                        //console.log(res);
                        should.not.exist(err);
                        res.should.have.status(200);
                        //console.log(res.body);
                        next();
                    });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/block')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var blocks = data.blocks;
                    expect(data.metadata.count).to.equal(3);
                    expect(containsBlock(1, 0, blocks)).to.equal(true);
                    expect(containsBlock(2, 1, blocks)).to.equal(true);
                    expect(containsBlock(3, 1, blocks)).to.equal(true);
                    expect(containsBlock(0, 1, blocks)).to.equal(false);

                    done();
                });
            });
        });
    });

    describe('DELETE /block/:idBlockerUser', () => {
        it('It should delete all of user\'s Blocks', (done) => {
            async.waterfall([
                function (next) {
                    testUtils.createBlock("0", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("1", "0", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("0", "3", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("0", "5", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("2", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    testUtils.createBlock("3", "1", (err, res) => {
                        should.not.exist(err);
                        res.should.have.status(200);
                        next();
                    });
                },
                function (next) {
                    chai.request(server)
                    .delete('/block')
                    .end((err, res) => {
                        //console.log(res);
                        should.not.exist(err);
                        res.should.have.status(200);
                        //console.log(res.body);
                        next();
                    });
                }
            ],
            function (err, res) {
                if (err) {
                    done(err);
                    return;
                }
                chai.request(server)
                .get('/block')
                .end((err, res) => {
                    //console.log(res);
                    should.not.exist(err);
                    res.should.have.status(200);
                    var data = res.body;
                    var blocks = data.blocks;
                    expect(data.metadata.count).to.equal(0);

                    done();
                });
            });
        });
    });

});

function containsBlock(idBlockerUser, idBlockedUser, blocks) {
    for (var i = 0; i < blocks.length; ++i) {
        if (blocks[i].idBlockerUser == idBlockerUser
                && blocks[i].idBlockedUser == idBlockedUser) {
            return true;
        }
    }
    return false;
};

