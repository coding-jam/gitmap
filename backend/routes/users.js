var express = require('express');
var _ = require('underscore');
var userAdapter = require('../services/adapters/mongodb/users-adapter');
var api = require('../services/api-params');

var router = express.Router();

router.get('/', function (req, res) {
    userAdapter.getUsersPerCountry(api.getApiPath() + api.usersPath)
        .then(function(users) {
            res.json(users);
        });
});

router.get('/:country', function (req, res) {
    userAdapter.getUsersPerDistrict(req.params.country, api.getApiPath() + api.usersPath + '/' + req.params.country)
        .then(function(users) {
            var resBody = _.extend({}, users);
            resBody.links = {};
            addLanguagesInfo(resBody, req.params.country);
            addLocationsInfo(resBody, req.params.country);
            res.json(resBody);
        });

    function addLanguagesInfo(resBody, country) {
        resBody.links.languages = api.getApiPath() + api.languagesPath + '/' + country;
        resBody.usersInLocations.forEach(function(location) {
            location.languages = location.usersDetails.replace(api.usersPath, api.languagesPath);
        });
    }

    function addLocationsInfo(resBody, country) {
        resBody.links.locationsDetails = api.getApiPath() + api.locationsPath + '/' + country;
    }
});

router.get('/:country/:district', function (req, res) {
    userAdapter.getByDistrict(req.params.country, req.params.district, req.query.languages ? req.query.languages.split(',') : null)
        .then(function(users) {
            res.json(users);
        });
});

module.exports = router;