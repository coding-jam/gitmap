var httpUtils = require('./http-utils');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Countries Routes Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function() {
        require('../../server');
    });

    describe('/countries', function () {

        it('should return all countries basic geo info', function (done) {

            httpUtils.getUri('/countries')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.has.property('continents');
                    expect(resp.body).to.has.deep.property('continents.europe.countries');
                    expect(resp.body.continents).is.a('object');
                    expect(resp.body.continents.europe.countries).to.have.property('it');
                    expect(resp.body.continents.europe.countries.it).to.have.deep.property('links.details', '/api/v1/countries/it');
                    expect(resp.body.continents.europe.countries).to.have.property('uk');
                    expect(resp.body.continents.europe.countries.uk).to.have.deep.property('links.details', '/api/v1/countries/uk');
                    expect(resp.body.continents.europe.countries).to.have.property('sp');
                    expect(resp.body.continents.europe.countries.sp).to.have.deep.property('links.details', '/api/v1/countries/sp');
                    expect(resp.body.continents.europe.countries).to.have.property('fr');
                    expect(resp.body.continents.europe.countries.fr).to.have.deep.property('links.details', '/api/v1/countries/fr');

                    expect(resp.body).to.have.property('links');
                    expect(resp.body).to.have.deep.property('links.allUsers', '/api/v1/users');
                })
                .done(done);
        });
    });

    describe('/countries/:country', function () {

        it('should return all routes for a Italy', function (done) {

            httpUtils.getUri('/countries/it')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.have.property('users', '/api/v1/users/it');
                    expect(resp.body).to.have.property('locations', '/api/v1/locations/it');
                    expect(resp.body).to.have.property('languages', '/api/v1/languages/it');
                })
                .done(done);
        });

        it('should return all routes for a Uk', function (done) {

            httpUtils.getUri('/countries/uk')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.have.property('users', '/api/v1/users/uk');
                    expect(resp.body).to.have.property('locations', '/api/v1/locations/uk');
                    expect(resp.body).to.have.property('languages', '/api/v1/languages/uk');
                })
                .done(done);
        });
    });

});
