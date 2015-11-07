var httpUtils = require('./../http-utils');
var expect = require('chai').expect;

describe('Input Validators Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function() {
        require('../../../server');
    });

    describe('/*/:country/*', function () {

        it('should return Bad Request (http 400) for not allowed countries', function (done) {

            httpUtils.getUri('/countries/ita')
                .then(function (resp) {
                    expect(resp.header.statusCode).to.be.equal(400);
                })
                .done(done);
        });

        it('should allow /countries url with no ":country" as path param', function (done) {

            httpUtils.getUri('/countries')
                .then(function (resp) {
                    expect(resp.header.statusCode).to.be.equal(200);
                })
                .done(done);
        });

        it('should allow "it" country ', function (done) {

            httpUtils.getUri('/countries/it')
                .then(function (resp) {
                    expect(resp.header.statusCode).to.be.equal(200);
                })
                .done(done);
        });

        it('should allow "uk" country ', function (done) {

            httpUtils.getUri('/countries/uk')
                .then(function (resp) {
                    expect(resp.header.statusCode).to.be.equal(200);
                })
                .done(done);
        });

        it('should allow "sp" country ', function (done) {

            httpUtils.getUri('/countries/sp')
                .then(function (resp) {
                    expect(resp.header.statusCode).to.be.equal(200);
                })
                .done(done);
        });

        it('should allow "fr" country ', function (done) {

            httpUtils.getUri('/countries/fr')
                .then(function (resp) {
                    expect(resp.header.statusCode).to.be.equal(200);
                })
                .done(done);
        });
    });
});