var _ = require("underscore");
var Q = require('q');
var userDs = require("./../../dao/files/users-datasource");
var locationDs = require("./../../dao/files/locations-datasource");
var countryMappings = require("./../../country-mappings");
require('./../../utils');

var userAdapter = {

    /**
     * @deprecated use {@link getByDistrict}
     *
     * Return italian users in a region
     *
     * @param regione
     * @returns {Promise}
     */
    getByRegione: function (regione) {
        var locationsFound;
        return locationDs.findRegioneBy(regione)
            .then(function (locations) {
                locationsFound = locations;
                return userDs.findBy('it', _.keys(locations));
            })
            .then(function (users) {
                return _.chain(users.items)
                    .map(function (user) {
                        user.geolocation = locationsFound[user.location];
                        return user;
                    })
                    .sortBy(function(user) {
                        return user.login.toLowerCase();
                    })
                    .value();
            })
            .then(function(filtered) {
                return {
                    total_count: filtered.length,
                    items: filtered
                }
            });
    },

    /**
     * Return all user in a district of a country
     *
     * @param country
     * @param district
     * @returns {Promise}
     */
    getByDistrict: function (country, district, languages) {
        var locationsFound;
        return locationDs.findLocationsBy(country, district)
            .then(function (locations) {
                locationsFound = locations;
                return userDs.findBy(country, _.keys(locations), languages);
            })
            .then(function (users) {
                return _.chain(users.items)
                    .map(function (user) {
                        if (user.location) {
                            user.geolocation = locationsFound[user.location.toLowerCase()];
                        }
                        return user;
                    })
                    .sortBy(function(user) {
                        return user.login.toLowerCase();
                    })
                    .value();
            })
            .then(function(filtered) {
                return {
                    total_count: filtered.length,
                    items: filtered
                }
            });
    },

    getUsersPerRegione: function(baseUrl) {
        var result = {
            usersInLocations: []
        };
        return locationDs.getRegioni()
            .then(function(regioni) {
                var promises = [];
                regioni.forEach(function(regione) {
                    var deferredLoop = Q.defer();
                    userAdapter.getByRegione(regione.toLowerCase())
                        .then(function(users) {
                            deferredLoop.resolve({
                                districtName: regione,
                                usersDetails: baseUrl + '/' + encodeURIComponent(regione.toLowerCase()),
                                usersCount: users.total_count
                            });
                        })
                        .catch(function(err) {
                            deferredLoop.reject(err);
                        });
                    promises.push(deferredLoop.promise);
                });
                return Q.all(promises);
            })
            .then(function(usersPerRegions) {
                result.usersInLocations = usersPerRegions
                return result;
            });

    },

    getUsersPerDistrict: function(country, baseUrl) {
        var result = {
            usersInLocations: []
        };
        return locationDs.getDistricts(country)
            .then(function(districts) {
                var promises = [];
                districts.forEach(function(district) {
                    var deferredLoop = Q.defer();
                    userAdapter.getByDistrict(country, district.toLowerCase())
                        .then(function(users) {
                            deferredLoop.resolve({
                                districtName: district,
                                usersDetails: baseUrl + '/' + encodeURIComponent(district.toLowerCase()),
                                usersCount: users.total_count
                            });
                        })
                        .catch(function(err) {
                            deferredLoop.reject(err);
                        });
                    promises.push(deferredLoop.promise);
                });
                return Q.all(promises);
            })
            .then(function(usersPerDistricts) {
                result.usersInLocations = usersPerDistricts
                return result;
            });

    },

    getUsersPerCountry: function(baseUrl) {
        var result = {
            usersInCounties: []
        };

        var promises = [];
        _.keys(countryMappings.language).forEach(function(country) {
            var deferredLoop = Q.defer();
            userDs.getUsers(country)
                .then(function(users) {
                    result.usersInCounties.push({
                        countryName: countryMappings.location[country].capitalize(),
                        countryKey: country,
                        countryDetails: baseUrl + '/' + country,
                        usersCount: users.total_count
                    });
                    deferredLoop.resolve();
                }).catch(deferredLoop.reject);
            promises.push(deferredLoop.promise);
        });
        return Q.all(promises).then(function() {
            return result;
        });
    }

};

module.exports = userAdapter;