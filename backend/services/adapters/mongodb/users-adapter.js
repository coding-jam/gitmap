var _ = require("underscore");
var Q = require("q");
var db = require('./../../dao/mongodb/mongo-connection');
var locationDs = require('./../../dao/mongodb/locations-datasource');
var countriesDs = require('./../../dao/mongodb/countries-datasource');
var countryMappings = require("./../../country-mappings");
require('./../../utils');

function districtFindModel(district, languages) {
    var findModel = {
        'gitmap.geolocation.address_components': {$elemMatch: {short_name: new RegExp('^' + district + '$', 'i')}}
    };

    if (languages) {
        findModel.languages = {$all: normalizeForQuery(languages)};
    } else {
        findModel['languages.0'] = {$exists: true};
    }
    return findModel;

    function normalizeForQuery(array) {
        if (array && array.length) {
            return _.chain(array)
                .map(function (value) {
                    return value.toLowerCase().trim();
                })
                .filter(function (value) {
                    return !!value;
                })
                .map(function (value) {
                    return new RegExp('^' + value + '$', 'i');
                })
                .value();
        } else {
            return array;
        }
    }
};

var userAdapter = {

    /**
     * Return all user in a district of a country
     *
     * @param country
     * @param district
     * @returns {Promise}
     */
    getByDistrict: function (country, district, languages, dbFunc) {
        if (dbFunc) {
            return Q.when(findUsers(dbFunc, country));
        } else {
            return Q.when(db().then(function (db) {
                return findUsers(db, country)
                    .then(function (users) {
                        db.close();
                        return users;
                    });
            }));
        }

        function findUsers(db, country) {
            return db.collection(country + '_users')
                .find(districtFindModel(district, languages))
                .toArray()
                .then(function (users) {
                    return {
                        total_count: users.length,
                        items: users
                    };
                })
        }
    },

    /**
     * Count user in a district of a country
     *
     * @param country
     * @param district
     * @param languages
     * @param dbFunc [optional]
     * @returns {Promise}
     */
    countByDistrict: function (country, district, languages, dbFunc) {
        if (dbFunc) {
            return Q.when(findUsers(dbFunc, country, district, languages));
        } else {
            return Q.when(db().then(function (db) {
                return findUsers(db, country, district, languages)
                    .then(function (count) {
                        db.close();
                        return count;
                    });
            }));
        }

        function findUsers(db, country, district, languages) {
            return db.collection(country + '_users')
                .find(districtFindModel(district, languages))
                .count(false);
        }
    },

    /**
     * Return users count per district
     *
     * @param country
     * @param baseUrl
     * @returns {Promise}
     */
    getUsersPerDistrict: function (country, baseUrl) {
        var users = db().then(function (db) {
            return locationDs.getDistricts(country, db)
                .then(function (districts) {
                    return Q.each(districts, function (deferred, district) {
                        userAdapter.countByDistrict(country, district.district, null, db)
                            .then(function (count) {
                                deferred.resolve({
                                    districtName: district.district,
                                    usersDetails: baseUrl + '/' + encodeURIComponent(district.district.toLowerCase()),
                                    usersCount: count
                                });
                            })
                            .catch(function (err) {
                                console.error(err);
                                deferred.reject(err);
                            });
                    });
                })
                .then(function (usersInLocations) {
                    db.close();
                    return {
                        usersInLocations: usersInLocations
                    }
                })
                .catch(function (err) {
                    db.close();
                    return Q.reject(err);
                })
        });

        return Q.when(users);
    },

    /**
     * Return users grouped by country
     *
     * @param baseUrl
     * @returns {Promise}
     */
    getUsersPerCountry: function (baseUrl) {
        var users = db().then(function (db) {
            return countriesDs.getCountriesLocations(db)
                .then(function (continents) {
                    return Q.each(_.keys(continents.europe.countries), function (deferred, country) {
                        db.collection(country + '_users')
                            .find({'languages.0': {$exists: true}})
                            .count(false)
                            .then(function (count) {
                                deferred.resolve({
                                    countryName: countryMappings.location[country].capitalize(),
                                    countryKey: country,
                                    countryDetails: baseUrl + '/' + country,
                                    usersCount: count
                                });
                            })
                    })
                        .then(function (usersInCounties) {
                            db.close();
                            return {
                                usersInCounties: usersInCounties
                            }
                        });
                })
        });
        return Q.when(users);
    }
};

module.exports = userAdapter;