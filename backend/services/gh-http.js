var request = require("request");
var requestSync = require('sync-request');
var Q = require("q");
var _ = require("underscore");

var ghHttp = {

    secrets: 'client_id=51f5e69c42514ef98707&client_secret=a57c2fabcf4f3c655d9381b2c56134f76fa8fdc5',

    rateLimit: {
        requests: {
            limit: 5000,
            interval: 60 * 60 * 1000,
            resetTime: 0
        },
        search: {
            limit: 30,
            interval: 1 * 60 * 1000,
            resetTime: 0
        },
        activeRequests: 0,

    },

    options: {
        method: "GET",
        timeout: 1000000,
        followRedirect: true,
        maxRedirects: 10,
        headers: {
            'User-Agent': 'gitmap'
        }
    },

    getWithLimit: function(url, isSearch) {

        var queueRateLimit = getQueueLimits(isSearch);
        if (ghHttp.rateLimit.activeRequests < queueRateLimit.limit) {
            return execOrdelayRequest(isSearch ? ghHttp.rateLimit.search : ghHttp.rateLimit.requests, queueRateLimit);
        } else {
            console.info('Queue limit of ' + queueRateLimit.limit + ' exceeded, add delay of ' + (queueRateLimit.interval / 1000) + ' seconds');
            return delayRequest(queueRateLimit.interval, url, isSearch);
        }

        function getQueueLimits(isSearch) {
            if (isSearch) {
                return {
                    limit: 5,
                    interval: 1 * 1000
                }
            } else {
                return {
                    limit: 20,
                    interval: 8 * 1000
                }
            }
        }

        function execOrdelayRequest(limitParams, queueRateLimit) {
            if (ghHttp.rateLimit.activeRequests < limitParams.limit || limitParams.resetTime * 1000 <= Date.now()) {
                console.info('Execute request now: limit set to ' + limitParams.limit);
                return executeRequest(limitParams);
            } else {
                var interval = Math.abs((limitParams.resetTime * 1000) - Date.now()) + (queueRateLimit.interval * 3);
                console.log('Apply request delay of ' + (interval / 1000) + ' seconds');
                return delayRequest(interval, url, isSearch);
            }
        }

        function delayRequest(delay, url, isSearch) {
            return Q.delay(delay).then(function() {
                return ghHttp.getWithLimit(url, isSearch);
            });
        };

        function executeRequest(limitParams) {
            var options = _.clone(ghHttp.options);
            options.uri = url;
            ghHttp.rateLimit.activeRequests++

            console.log('Start new request. Active requests: ' + ghHttp.rateLimit.activeRequests);

            var deferred = Q.defer();
            request(options, function (error, response, body) {
                ghHttp.rateLimit.activeRequests--
                if (error || !response.headers['content-type'].match('application/json')) {
                    console.error('REJECTED. Active requests: ' + ghHttp.rateLimit.activeRequests);
                    console.error(error || body);
                    deferred.reject(error || body);
                } else {
                    ghHttp.updateLimits(response, limitParams);
                    console.log('Resolved. Active requests: ' + ghHttp.rateLimit.activeRequests);
                    deferred.resolve({response: response, body: JSON.parse(body)});
                }
            });
            return deferred.promise;
        }
    },

    updateLimits: function (response, limitParams) {
        var newResetTime = response.headers['x-ratelimit-reset'];
        var newLimit = response.headers['x-ratelimit-remaining'];
        if (limitParams.resetTime == newResetTime) {
            limitParams.limit = Math.min(newLimit, limitParams.limit);
        } else {
            limitParams.limit = newLimit;
            limitParams.resetTime = newResetTime;
        }
    },

    setupApiLimits: function() {

        var headers = _.extend({}, ghHttp.options.headers);
        headers['If-None-Match'] = 'W/"bbb234d54455c9ae9fe93d66e6c041a1"';
        getLimitsFor(ghHttp.rateLimit.requests, 'https://api.github.com/users/cosenonjaviste?');
        getLimitsFor(ghHttp.rateLimit.search, 'https://api.github.com/search/users?q=cosenonjaviste%20in:name%20type:user&');

        function getLimitsFor(limitParams, url) {
            var res = requestSync('GET', url + ghHttp.secrets, {
                'headers': headers
            });
            ghHttp.updateLimits(res, limitParams);
        };
    }
}

ghHttp.setupApiLimits();

module.exports = ghHttp;