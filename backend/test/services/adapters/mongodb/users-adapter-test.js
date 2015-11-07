var usersAdapter = require('../../../../services/adapters/mongodb/users-adapter');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Users Mongo Adapter Test suite', function () {

    this.timeout(100000);
    this.slow(250000);

    describe('getByDistrict', function () {

        it('should return users in Molise, Italy', function (done) {

            usersAdapter.getByDistrict('it', 'Molise')
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users).has.property('items');
                    expect(users.total_count).to.be.least(5);
                })
                .done(done);
        });

        it('should return users in Molise programming C', function (done) {

            usersAdapter.getByDistrict('it', 'Molise', ['C'])
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users).has.property('items');
                    expect(users.total_count).to.be.least(2);
                })
                .done(done);
        });

        it('should return users in Molise programming Java and C', function (done) {

            usersAdapter.getByDistrict('it', 'Molise', ['Java', 'C'])
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users).has.property('items');
                    expect(users.total_count).to.be.least(2);
                })
                .done(done);
        });
    });

    describe('getUsersPerDistrict', function () {

        it('should return italian users grouped by regions', function (done) {

            usersAdapter.getUsersPerDistrict('it', 'http://mock.url')
                .then(function (users) {
                    expect(users).has.property('usersInLocations');
                    expect(users.usersInLocations).to.have.length(20);
                    expect(users.usersInLocations).to.have.deep.property('[0].districtName');
                    expect(users.usersInLocations).to.have.deep.property('[0].usersDetails');
                    expect(users.usersInLocations).to.have.deep.property('[0].usersCount');
                    expect(users.usersInLocations).to.have.deep.property('[19].districtName');
                    expect(users.usersInLocations).to.have.deep.property('[19].usersDetails');
                    expect(users.usersInLocations).to.have.deep.property('[19].usersCount');

                    var molise = _.find(users.usersInLocations, function (location) {
                        return location.districtName == 'Molise';
                    });

                    expect(molise.usersCount).to.be.below(10);
                })
                .done(done);
        });

        it('should return uk users grouped by districts', function (done) {

            usersAdapter.getUsersPerDistrict('uk', 'http://mock.url')
                .then(function (users) {
                    expect(users).has.property('usersInLocations');
                    expect(users.usersInLocations).to.have.length(147);
                    expect(users.usersInLocations).to.have.deep.property('[0].districtName');
                    expect(users.usersInLocations).to.have.deep.property('[0].usersDetails');
                    expect(users.usersInLocations).to.have.deep.property('[0].usersCount');
                    expect(users.usersInLocations).to.have.deep.property('[146].districtName');
                    expect(users.usersInLocations).to.have.deep.property('[146].usersDetails');
                    expect(users.usersInLocations).to.have.deep.property('[146].usersCount');

                    var molise = _.find(users.usersInLocations, function (location) {
                        return location.districtName == 'Windsor and Maidenhead';
                    });

                    expect(molise.usersCount).to.be.least(22);
                })
                .done(done);
        });
    });

    describe('getUsersPerCountry', function () {

        it('should return all users count per country', function (done) {

            usersAdapter.getUsersPerCountry('http://mock.url')
                .then(function (result) {
                    expect(result).has.property('usersInCounties');
                    expect(result.usersInCounties).to.be.a('array');
                    expect(result.usersInCounties).has.length(5);
                    expect(result.usersInCounties).has.deep.property('[0].countryName');
                    expect(result.usersInCounties).has.deep.property('[0].countryKey');
                    expect(result.usersInCounties).has.deep.property('[0].countryDetails');
                    expect(result.usersInCounties).has.deep.property('[0].usersCount');
                })
                .done(done);
        });
    });
});