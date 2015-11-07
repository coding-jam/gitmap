var httpUtils = require('./http-utils');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Languages Routes Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function() {
        require('../../server');
    });

    describe('/languages', function () {

        it('should return all languages per countries', function (done) {

            httpUtils.getUri('/languages')
                .then(function (resp) {
                    expect(resp.body).to.have.property('languagesPerCountries');
                    expect(resp.body.languagesPerCountries).to.be.a('array');
                    expect(resp.body.languagesPerCountries).to.have.deep.property('[0].links.details', '/api/v1/languages/fr');
                })
                .done(done);
        });
    });

    describe('/languages/:country', function () {

        it('should return all italian languages', function (done) {

            httpUtils.getUri('/languages/it')
                .then(function(resp) {
                    expectResponseStructure(resp, 'it');
                })
                .done(done);
        });

        it('should return all uk locations info', function (done) {

            httpUtils.getUri('/languages/uk')
                .then(function(resp) {
                    expectResponseStructure(resp, 'uk');
                })
                .done(done);
        });

        function expectResponseStructure(resp, country) {
            expect(resp.body).to.be.not.null;
            expect(resp.body).is.a('object');
            expect(resp.body).to.have.property('languages');
            expect(resp.body).to.have.property('links');
            expect(resp.body.links).is.a('object');
            expect(resp.body.links).to.have.property('languagesPerDistrict', '/api/v1/languages/' + country + '/per-district');
            expect(resp.body.links).to.have.property('singleDistrict', '/api/v1/languages/' + country + '/{:districtName}');
        }
    });

    describe('/languages/:country/per-district', function () {

        it('should return all Italian languages grouped by regions', function (done) {

            httpUtils.getUri('/languages/it/per-district')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.have.property('languagesPerDistricts');
                })
                .done(done);
        });

        it('should return all Uk languages grouped by districts', function (done) {

            httpUtils.getUri('/languages/uk/per-district')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.have.property('languagesPerDistricts');
                })
                .done(done);
        });

    });

    describe('/languages/:country/:district', function () {

        it('should return Italian languages in Tuscany', function (done) {

            httpUtils.getUri('/languages/it/toscana')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.be.a('array');
                    expect(resp.body).to.have.length.least(57);
                })
                .done(done);
        });

        it('should return Uk languages in Tuscany', function (done) {

            httpUtils.getUri('/languages/uk/west%20yorkshire')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.be.a('array');
                    expect(resp.body).to.have.length.least(65);
                })
                .done(done);
        });

    });

});
