var httpUtils = require('./http-utils');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Users Routes Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function() {
        require('../../server');
    });

    describe('/users', function () {

        it('should return all users count grouped by countries', function (done) {

            function getEntry(resp, countryDetails, countryName) {
                var italianUsers = _.find(resp.body.usersInCounties, function (details) {
                    return details.countryDetails == countryDetails && details.countryName == countryName;
                });
                return italianUsers;
            }

            httpUtils.getUri('/users')
                .then(function (resp) {
                    expect(resp.body).to.have.property('usersInCounties');
                    var italianUsers = getEntry(resp, '/api/v1/users/it', 'Italy');
                    var ukUsers = getEntry(resp, '/api/v1/users/uk', 'Uk');
                    expect(!!italianUsers).to.be.true;
                    expect(!!ukUsers).to.be.true;
                })
                .done(done);
        });
    });

    describe('/users/:country', function () {

        it('should return all italian region url', function (done) {

            httpUtils.getUri('/users/it')
                .then(function(resp) {
                    expect(resp.body).to.have.property('usersInLocations');
                    var molise = _.find(resp.body.usersInLocations, function(location) {
                        return location.districtName == 'Molise';
                    });
                    expect(molise.usersCount).to.be.below(10);
                    expect(molise.usersDetails).to.be.equal('/api/v1/users/it/molise');
                })
                .done(done);
        });

        it('should return links to italian locations and languages', function (done) {

            httpUtils.getUri('/users/it')
                .then(function(resp) {
                    expect(resp.body).to.have.property('links');
                    expect(resp.body.links).to.be.a('object');
                    expect(resp.body.links).to.have.property('languages');
                    expect(resp.body.links).to.have.property('locationsDetails');
                    expect(resp.body.links.languages).to.be.equal('/api/v1/languages/it');
                    expect(resp.body.links.locationsDetails).to.be.equal('/api/v1/locations/it');
                })
                .done(done);
        });

        it('should return all uk region url', function (done) {

            httpUtils.getUri('/users/uk')
                .then(function(resp) {
                    expect(resp.body).to.have.property('usersInLocations');
                    expect(resp.body).to.have.property('links');

                    var molise = _.find(resp.body.usersInLocations, function(location) {
                        return location.districtName == 'Windsor and Maidenhead';
                    });
                    expect(molise.usersCount).to.be.least(22);
                    expect(molise.usersDetails).to.be.equal('/api/v1/users/uk/windsor%20and%20maidenhead');
                })
                .done(done);
        });

        it('should return links to uk locations and languages', function (done) {

            httpUtils.getUri('/users/uk')
                .then(function(resp) {
                    expect(resp.body).to.have.property('links');
                    expect(resp.body.links).to.be.a('object');
                    expect(resp.body.links).to.have.property('languages');
                    expect(resp.body.links).to.have.property('locationsDetails');
                    expect(resp.body.links.languages).to.be.equal('/api/v1/languages/uk');
                    expect(resp.body.links.locationsDetails).to.be.equal('/api/v1/locations/uk');
                })
                .done(done);
        });

        it('should return all germany states url', function (done) {

            httpUtils.getUri('/users/ge')
                .then(function(resp) {
                    expect(resp.body).to.have.property('usersInLocations');
                    var hessen = _.find(resp.body.usersInLocations, function(location) {
                        return location.districtName == 'HE';
                    });
                    expect(hessen.usersCount).to.be.least(819);
                    expect(hessen.usersDetails).to.be.equal('/api/v1/users/ge/he');
                })
                .done(done);
        });
    });

    describe('/:country/:district', function () {

        it('should return users in Molise, Italy', function(done) {

            httpUtils.getUri('/users/it/molise')
                .then(function(resp) {
                    expect(resp.body).to.have.property('total_count');
                    expect(resp.body).to.have.property('items');
                    expect(resp.body.items).is.a('array');
                    expect(resp.body.items).has.length.least(5);
                })
                .done(done);
        });

        it('should return users in Windsor and Maidenhead, UK', function(done) {

            httpUtils.getUri('/users/uk/windsor%20and%20maidenhead')
                .then(function(resp) {
                    expect(resp.body).to.have.property('total_count');
                    expect(resp.body).to.have.property('items');
                    expect(resp.body.items).is.a('array');
                    expect(resp.body.items).has.length.least(22);
                })
                .done(done);
        });

        it('should return users in Windsor and Maidenhead, UK programming JavaScript', function(done) {

            httpUtils.getUri('/users/uk/windsor%20and%20maidenhead?languages=javascript')
                .then(function(resp) {
                    expect(resp.body).to.have.property('total_count');
                    expect(resp.body).to.have.property('items');
                    expect(resp.body.items).is.a('array');
                    expect(resp.body.items).has.length.least(13);
                })
                .done(done);
        });

        it('should return users in Windsor and Maidenhead, UK programming JavaScript, ending url with "comma"', function(done) {

            httpUtils.getUri('/users/uk/windsor%20and%20maidenhead?languages=javascript,')
                .then(function(resp) {
                    expect(resp.body.items).has.length.least(13);
                })
                .done(done);
        });

    });

});
