var _ = require("underscore");
var Q = require('q');
var countriesData = require(__dirname + '/../../../data/countries');
var continents = require(__dirname + '/../../../data/static_continents');

var countriesDs = {

    getCountriesLocations: function() {
        return Q.fcall(function() {
            var result = {
                europe: {
                    name: continents.europe.results[0].formatted_address,
                    geometry: continents.europe.results[0].geometry,
                    countries: {}
                }
            };
            _.keys(countriesData).forEach(function(country) {
                result.europe.countries[country] = {
                    name: countriesData[country].results[0].formatted_address,
                    geometry: countriesData[country].results[0].geometry
                };
            });

            return result;
        });
    }

};

module.exports = countriesDs;