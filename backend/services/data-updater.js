/**
 * data updater is a script to update user data.
 **/

'use strict';

var connectToDB = require('./dao/mongodb/mongo-connection');
var Rx = require('rx');
var _ = require('underscore');
var Q = require('Q')

var connect = _.compose(Q.when, connectToDB);

function updaterFactory() {

    /**
     * return all user in the db
     */
    function extractUser() {

    }

    /**
     *
     * @param country to select users
     */
    function selectUserByCountry(country) {
        var subject = new Rx.Subject();
        connectToDB().then(function (db) {
            return db.collection(country + "_users").find({}).limit(5).forEach(function (user) {
                subject.onNext(user);
            }, function () {
                db.close();
                subject.onCompleted();
            });
        });
        return subject;
    }

    return {
        selectUserByCountry : selectUserByCountry
    };
}

module.exports = updaterFactory();


