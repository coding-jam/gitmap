var httpUtils = require('./../http-utils');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Cache middleware Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function () {
        require('../../../server');
    });

    describe('sequence call twice /users/uk', function () {

        it('should return uk users from cache', function (done) {

            var startTime = Date.now();
            var firstCallTime;
            httpUtils.getUri('/users/uk')
                .then(function (resp) {
                    firstCallTime = Date.now() - startTime;

                    expect(resp.body).to.have.property('usersInLocations');

                    startTime = Date.now();
                    return httpUtils.getUri('/users/uk');
                })
                .then(function (resp) {
                    var secondCallTime = Date.now() - startTime;
                    expect(secondCallTime).to.be.below(firstCallTime);

                    expect(resp.body).to.have.property('usersInLocations');
                })
                .done(done);
        });
    });

    describe('sequence call /users, /users/it, /users again', function () {

        it('should return same result calling /users twice', function (done) {

            httpUtils.getUri('/users')
                .then(function (resp) {
                    expect(resp.body).to.have.property('usersInCounties');
                    return httpUtils.getUri('/users/it');
                })
                .then(function (resp) {
                    expect(resp.body).to.have.property('usersInLocations');
                    return httpUtils.getUri('/users')
                })
                .then(function (resp) {
                    expect(resp.body).to.have.property('usersInCounties');
                })
                .done(done);
        });
    });
});