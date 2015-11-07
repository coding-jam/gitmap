var _ = require("underscore");
var Q = require('q');
var db = require('./../../dao/mongodb/mongo-connection');
var locationsDs = require('./../../dao/mongodb/locations-datasource');
var countriesDs = require('./../../dao/mongodb/countries-datasource');
var countryMappings = require("./../../country-mappings");
require('./../../utils');

function createGroupByLanguageModel() {
    return [
        {$unwind: "$languages"},
        {$group: {_id: "$languages", usersPerLanguage: {$sum: 1}}},
        {$sort: {usersPerLanguage: -1, _id: 1}}
    ];
}

var languagesAdapter = {

    getRankedLanguages: function (country, district, dbRef) {

        var findModel = createGroupByLanguageModel();
        if (district) {
            findModel.unshift({$match: {'gitmap.geolocation.address_components': {$elemMatch: {short_name: new RegExp('^' + district + '$', 'i')}}}});
        }

        if (dbRef) {
            return Q.when(executeQuery(dbRef, country, findModel));
        } else {
            return Q.when(db().then(function (db) {
                return executeQuery(db, country, findModel)
                    .then(function (ranked) {
                        db.close();
                        return ranked;
                    })
            }));
        }

        function executeQuery(db, country, findModel) {
            return db.collection(country + '_users')
                .aggregate(findModel)
                .toArray()
                .then(function (result) {
                    var ranked = _.map(result, function (res) {
                        res.language = res._id;
                        delete res._id;
                        return res;
                    });
                    return ranked;
                })
        }
    },

    getLanguagesPerDistrict: function (country) {
        return Q.when(db().then(function (db) {
            return locationsDs.getDistricts(country, db)
                .then(function (districts) {
                    return Q.each(districts, function (deferred, district) {
                        languagesAdapter.getRankedLanguages(country, district.district.toLowerCase(), db)
                            .then(function (languages) {
                                deferred.resolve({
                                    districtName: district.district,
                                    languages: languages
                                });
                            })
                    })
                })
                .then(function (languagesPerDistricts) {
                    db.close();
                    return {
                        languagesPerDistricts: languagesPerDistricts
                    }
                })
        }));
    },

    getLanguagesPerCountry: function () {
        return Q.when(db().then(function (db) {
            return countriesDs.getCountriesLocations()
                .then(function (continents) {
                    return Q.each(_.keys(continents.europe.countries), function (deferred, country) {
                        languagesAdapter.getRankedLanguages(country, null, db)
                            .then(function (languages) {
                                deferred.resolve({
                                    countryName: countryMappings.location[country].capitalize(),
                                    countryKey: country,
                                    languages: languages
                                });
                            })
                    })
                })
                .then(function (languagesPerCountry) {
                    db.close();
                    return {
                        languagesPerCountries: languagesPerCountry
                    };
                })
        }));
    }
}

module.exports = languagesAdapter;