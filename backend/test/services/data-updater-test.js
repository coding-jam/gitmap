'use strict';

var updater = require('../../services/data-updater');

var expect = require('chai').expect;
var Q = require('Q');

describe('Data updater test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    describe('when select all user by country it', function () {

        it('expect return all italian user', function (done) {

            var toArray = updater.selectUserByCountry('it')
                .then(function (cursor) {
                    return cursor.limit(5).toArray();

                })
                .then(function (array) {
                    expect(array).to.be.not.empty;
                    return array;
                })
                .then(console.log)
                .then(done);

        });
    });

    describe.only('Learning RX', function () {

        it('test RX', function (done) {

            var times = 0;
            var subject = updater.selectUserByCountry('it');
            subject.subscribe(function (user) {
                    console.log(user);
                    console.log(times++);
                });
            subject.subscribeOnCompleted(done);
        });

    })
});