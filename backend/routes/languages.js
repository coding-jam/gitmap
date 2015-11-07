var express = require('express');
var _ = require('underscore');
var languagesAdapter = require('../services/adapters/mongodb/languages-adapter');
var api = require('../services/api-params');

var router = express.Router();

router.get('/', function (req, res) {

    languagesAdapter.getLanguagesPerCountry()
        .then(function(languages) {
            languages.languagesPerCountries.forEach(function(country) {
                country.links = {
                    details: api.getApiPath() + api.languagesPath + '/' + country.countryKey
                }
            });
            res.json(languages);
        });
});

router.get('/:country', function (req, res, next) {

    languagesAdapter.getRankedLanguages(req.params.country)
        .then(function(languages) {
            res.json({
                languages: languages,
                links: {
                    languagesPerDistrict: api.getApiPath() + api.languagesPath + '/' + req.params.country + '/per-district',
                    singleDistrict: api.getApiPath() + api.languagesPath + '/' + req.params.country + '/{:districtName}'
                }
            });
        })
        .catch(next);
});

router.get('/:country/per-district', function (req, res) {

    languagesAdapter.getLanguagesPerDistrict(req.params.country)
        .then(function(languages) {
            res.json(languages);
        });
});

router.get('/:country/:district', function (req, res) {

    languagesAdapter.getRankedLanguages(req.params.country, req.params.district)
        .then(function(languages) {
            res.json(languages);
        });
});

module.exports = router;