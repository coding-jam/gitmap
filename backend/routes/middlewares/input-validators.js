var countryMapping = require(__dirname + '/../../services/country-mappings');
var _ = require('underscore');
var api = require(__dirname + '/../../services/api-params');

module.exports = function(req, res, next) {
    var matchCountry = _.chain(countryMapping.location)
        .keys()
        .map(function(val) {
            return '/' + val + '$|/' + val + '/';
        })
        .value()
        .join('|');
    if (req.originalUrl.match(matchCountry + '|' + api.countriesPath + '$|' + api.usersPath + '$|' + api.languagesPath + '$|favicon.ico$')) {
        next();
    } else {
        var err = new Error('Country unknown!');
        err.status = 400;
        next(err);
    }
};