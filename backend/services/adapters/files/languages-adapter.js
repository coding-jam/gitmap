var _ = require("underscore");
var Q = require('q');
var userDs = require("./../../dao/files/users-datasource");
var locationDs = require("./../../dao/files/locations-datasource");
var countryMappings = require("./../../country-mappings");
require('./../../utils');

function sortByValue(obj, desc) {
    var sortable = [];
    for (var key in obj) {
        sortable.push([key, obj[key]])
    }
    sortable.sort(function (a, b) {
        return desc ? b[1] - a[1] : a[1] - b[1]
    })
    return sortable;
}

function findLanguages(users) {
    var languages = _.chain(users.items)
        .map('languages')
        .flatten()
        .countBy(function (lang) {
            return lang;
        })
        .value();
    return sortByValue(languages, true);
}

function adaptLanguages(languages) {
    return _.map(languages, function (language) {
        return {
            language: language[0],
            usersPerLanguage: language[1]
        }
    });
}

var languagesAdapter = {

    getRankedLanguages: function (country, district) {

        if (district) {
            return locationDs.findLocationsBy(country, district)
                .then(function (locations) {
                    return userDs.findBy(country, _.keys(locations));
                })
                .then(findLanguages)
                .then(adaptLanguages)
        } else {
            return userDs.getUsers(country)
                .then(findLanguages)
                .then(adaptLanguages);
        }
    },

    getLanguagesPerDistrict: function (country) {
        return locationDs.getDistricts(country)
            .then(function (districts) {
                var promises = [];
                districts.forEach(function(district) {
                    var deferredLoop = Q.defer();
                    languagesAdapter.getRankedLanguages(country, district.toLowerCase())
                        .then(function(languages) {
                            deferredLoop.resolve({
                                districtName: district,
                                languages: languages
                            });
                        })
                        .catch(function(err) {
                            deferredLoop.reject(err);
                        });
                    promises.push(deferredLoop.promise);
                });
                return Q.all(promises);
            })
            .then(function(languagesPerDistricts) {
                return {
                    languagesPerDistricts: languagesPerDistricts
                }
            });
    },

    getLanguagesPerCountry: function () {
        var result = {
            languagesPerCountries: []
        };

        var promises = [];
        _.keys(countryMappings.language).forEach(function(country) {
            var deferredLoop = Q.defer();
            languagesAdapter.getRankedLanguages(country)
                .then(function(languages) {
                    result.languagesPerCountries.push({
                        countryName: countryMappings.location[country].capitalize(),
                        countryKey: country,
                        languages: languages
                    });
                    deferredLoop.resolve();
                })
                .catch(deferredLoop.resolve); //FIXME quando ci sono tutti i paesi
            promises.push(deferredLoop.promise);
        });
        return Q.all(promises)
            .then(function() {
                return result;
            });
    }
}

module.exports = languagesAdapter;