#!/usr/bin/env node
var _ = require('underscore');
var locationsDs = require('../files/locations-datasource');
var countries = _.keys(require('../../country-mappings').countryShortName);
var db = require('./mongo-connection');

function adaptDistricts(districts) {
    return _.map(districts, function (district) {
        district.details = district.details.results[0];
        return district;
    });
};

countries.forEach(function (country) {
    locationsDs.getDistrictsWithDetails(country)
        .then(function (districts) {
            db().then(function (db) {
                console.log('Starting writing districts of country ' + country.toUpperCase());
                db.collection(country + '_districts')
                    .insertMany(adaptDistricts(districts.districts))
                    .then(function (result) {
                        console.log(result.insertedCount + ' districts inserted of country ' + country.toUpperCase());
                        db.close();
                    })
                    .catch(console.error);
            })
        });
});

