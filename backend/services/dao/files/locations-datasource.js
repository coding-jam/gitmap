var _ = require("underscore");
var Q = require('q');
var countryMapping = require('./../../country-mappings');

var locationData = [];
locationData['it'] = require(__dirname + '/../../../data/it_locations');
locationData['uk'] = require(__dirname + '/../../../data/uk_locations');
locationData['sp'] = require(__dirname + '/../../../data/sp_locations');
locationData['fr'] = require(__dirname + '/../../../data/fr_locations');
locationData['ge'] = require(__dirname + '/../../../data/ge_locations');

var districtsData = [];
districtsData['it'] = require(__dirname + '/../../../data/it_districts');
districtsData['uk'] = require(__dirname + '/../../../data/uk_districts');
districtsData['sp'] = require(__dirname + '/../../../data/sp_districts');
districtsData['fr'] = require(__dirname + '/../../../data/fr_districts');
districtsData['ge'] = require(__dirname + '/../../../data/ge_districts');

var countryShortName = countryMapping.countryShortName;

function isCountry(addresses, country) {
    var found = _.find(addresses, function (address) {
        return (_.contains(address.types, 'country') && address.short_name == countryShortName[country]);
    });
    return found;
}

var locationsDs = {

    /**
     * Find locations from area level and name
     *
     * @param country it, uk, sp
     * @param areaLevel Google API area level
     * @param shortName district name
     * @returns {Promise}
     */
    findBy: function (country, areaLevel, shortName) {
        return Q.fcall(function () {
            var locationsFound = {};
            var countryData = locationData[country];
            _.keys(countryData).forEach(function (key) {

                if (countryData[key].length > 0) {
                    var found = _.find(countryData[key][0].address_components, function (address) {
                        return _.contains(address.types, areaLevel)
                            && address.short_name && address.short_name.toLowerCase() == shortName.toLowerCase();
                    });

                    if (found) {
                        locationsFound[key] = countryData[key];
                    }
                }
            });

            return locationsFound;
        });
    },

    /**
     * @deprecated use {@link findLocationsBy} providing Country (i.e. 'it', 'uk') and shortName
     *
     * @param shortName
     * @returns {Promise}
     */
    findRegioneBy: function (shortName) {
        return locationsDs.findLocationsBy('it', shortName);
    },

    /**
     * Return locations based on country and district
     *
     * @param country it, uk
     * @param shortName district name
     * @returns {Promise}
     */
    findLocationsBy: function (country, shortName) {
        return locationsDs.findBy(country, countryMapping.districtLevel[country], shortName);
    },

    /**
     * @deprecated use {@link findDistricts} providing Country (i.e. 'it', 'uk')
     *
     * Find regions from it_locations.json
     *
     * @returns {Promise}
     */
    findRegioni: function () {
        return locationsDs.findDistricts('it');
    },

    /**
     * Find all districts of a country from *_locations.json (slower than {@link getDistricts})
     *
     * @param country it, uk
     * @returns {Promise}
     */
    findDistricts: function(country) {
        return Q.fcall(function () {
            var regions = [];
            var countryData = locationData[country];
            _.keys(countryData).forEach(function (key) {
                if (countryData[key].length > 0 && isCountry(countryData[key][0].address_components, country)) {
                    var found = _.find(countryData[key][0].address_components, function (address) {
                        return _.contains(address.types, countryMapping.districtLevel[country]);
                    });
                    if (found && found.short_name.length >= countryMapping.districtMinShortNameLength[country]) {
                        regions.push(found.short_name);
                    }
                }
            });
            return _.unique(regions).sort();
        });
    },

    getDistrictsWithDetails: function (country) {
        return Q.when(districtsData[country]);
    },

    /**
     * @deprecated use {@link getDistricts} provinding Country (i.e. 'it', 'uk')
     *
     * @returns {Promise}
     */
    getRegioni: function () {
        return locationsDs.getDistricts('it');
    },

    /**
     * Return all districts of a country from *_districts.json
     *
     * @param country it, uk
     * @returns {Promise}
     */
    getDistricts: function (country) {
        return Q.fcall(function () {
            return _.map(districtsData[country].districts, function (region) {
                return region.district;
            });
        });
    },

    /**
     * Internal use only
     * @param country
     * @returns {*}
     */
    _getLocationData: function (country) {
        return locationData[country];
    }

}

module.exports = locationsDs;