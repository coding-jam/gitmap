var apiParams = require('../../services/api-params');
var request = require('request');
var Q = require('q');

var httpUtil = {

    options: {
        method: "GET",
        timeout: 1000000,
        followRedirect: true,
        maxRedirects: 10,
        json: true
    },

    getUri: function (uri) {
        httpUtil.options.uri = 'http://localhost:8080' + apiParams.getApiPath() + uri;
        return Q.nfcall(request, httpUtil.options)
            .then(function (resp) {
                return {header: resp[0], body: resp[1]};
            });
    }
}

module.exports = httpUtil;