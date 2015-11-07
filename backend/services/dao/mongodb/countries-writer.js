#!/usr/bin/env node
var countriesDs = require('../files/countries-datasource');
var db = require('./mongo-connection');
var _ = require('underscore');

countriesDs.getCountriesLocations()
    .then(function (countries) {
        db().then(function (db) {
            console.log('Starting writing countries');
            db.collection('countries')
                .insertOne(countries)
                .then(function () {
                    console.log('Countries inserited');
                    db.close();
                })
                .catch(console.error);
        })
    });
