var express = require('express');
var _ = require('underscore');
var countriesDs = require('../services/dao/mongodb/countries-datasource');
var api = require('../services/api-params');

var router = express.Router();

router.get('/', function (req, res) {
    countriesDs.getCountriesLocations()
        .then(function (continents) {
            _.keys(continents.europe.countries).forEach(function(country) {

                continents.europe.countries[country].links = {
                    details: api.getApiPath() + api.countriesPath + '/' + country,
                }

            });
            var resBody = {
                continents: continents,
                links: {
                    allUsers: api.getApiPath() + api.usersPath
                }
            };
            res.json(resBody);
        });
});

router.get('/:country', function (req, res) {

    res.json({
        users: api.getApiPath() + api.usersPath + '/' + req.params.country,
        locations: api.getApiPath() + api.locationsPath + '/' + req.params.country,
        languages: api.getApiPath() + api.languagesPath + '/' + req.params.country,
    });

});

module.exports = router;