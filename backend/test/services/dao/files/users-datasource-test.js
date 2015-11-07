var usersDs = require('../../../../services/dao/files/users-datasource');
var expect = require('chai').expect;

describe('Users Datasource Test suite', function () {

    this.timeout(100000);
    this.slow(250000);

    describe('getUsers', function () {

        it('should return italian users from it_users folder', function (done) {

            usersDs.getUsers('it')
                .then(function (users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.above(5800);
                    expect(users).has.property('items');
                    expect(users.total_count).to.be.equal(users.items.length);
                })
                .done(done);
        });

        it('should return germans users from ge_users folder', function (done) {

            usersDs.getUsers('ge')
                .then(function (users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.above(24000);
                    expect(users).has.property('items');
                    expect(users.total_count).to.be.equal(users.items.length);
                })
                .done(done);
        });
    });

    describe('findBy', function () {

        it('should return users in Florence area', function (done) {

            usersDs.findBy('it', ['florence, italy'])
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.least(64);
                })
                .done(done);
        });

        it('should return users in Florence area programming Java', function (done) {

            usersDs.findBy('it', ['florence, italy'], ['Java'])
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.least(14);
                })
                .done(done);
        });

        it('should return users in Florence area programming Java and Python', function (done) {

            usersDs.findBy('it', ['florence, italy'], ['Java', 'Python'])
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.least(7);
                })
                .done(done);
        });
    });

    describe('getCreationDate', function () {

        it('should return country folder creation date', function (done) {

            usersDs.getCreationDate('it')
                .then(function (date) {
                    expect(date).to.be.a('date');
                })
                .done(done);
        });
    });
});