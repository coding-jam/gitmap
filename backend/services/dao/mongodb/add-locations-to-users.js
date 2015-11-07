#!/usr/bin/env node
var Q = require('q');
var _ = require('underscore');
var locationsDs = require('../files/locations-datasource');
var countryMappings = require('./../../country-mappings');
var db = require('./mongo-connection');
require('../../utils');

var countries = _.keys(countryMappings.language);

countries.forEach(function (country) {
    db()
        .then(function (db) {
            var locations = locationsDs._getLocationData(country);

            var collection = db.collection(country + '_users');
            var promises = [];
            collection.find({})
                .forEach(function (user) {
                    if (user.location) {
                        var deferredLoop = Q.defer();
                        var geolocation = locations[user.location.toLowerCase()];
                        if (geolocation && geolocation.length > 0) {
                            collection.updateOne({_id: user._id},
                                {
                                    $set: {'gitmap.geolocation': geolocation[0]}
                                })
                                .then(function () {
                                    deferredLoop.resolve();
                                })
                                .catch(console.error);
                        } else {
                            console.log(country + ' --- ' + user.location.toLowerCase());
                            deferredLoop.resolve();
                        }
                        promises.push(deferredLoop.promise);
                    }
                }, function () {
                    Q.all(promises)
                        .then(function () {
                            console.log("Closing connection for country " + country);
                            db.close();
                        });
                });
        });
});