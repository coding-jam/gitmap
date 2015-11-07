var NodeCache = require("node-cache");
var Q = require('q');
var _ = require('underscore');

module.exports = function (options) {
    var cache = new CacheAdapter(options);

    return function (req, resp, next) {
        console.log('Requested url: ' + req.originalUrl);

        cache.addCacheCapabilities(resp, req.originalUrl);

        cache.get(req.originalUrl)
            .then(function (data) {
                console.log('Retrieving data from cache');
                resp.json(data);
            })
            .catch(function () {
                console.log('Processing new request');
                next();
            })
    };
};

function CacheAdapter(options) {

    var self = this;

    self.cache = new NodeCache(options);

    self.addCacheCapabilities = function (resp, url) {

        resp.json = (function(_super) {

            return function (data, cacheBody) {
                if (cacheBody || options.cacheAll) {
                    self.cache.set(url, data);
                }
                _super.apply(this, arguments);
            }
        })(resp.json);
    }

    self.get = function (key) {
        var deferred = Q.defer();
        self.cache.get(key, function (err, value) {
            if (err) {
                deferred.reject(err);
            } else if (value == undefined) {
                deferred.reject('No value found!');
            } else {
                deferred.resolve(value);
            }
        });
        return deferred.promise;
    };

    self.set = function (key, value) {
        var deferred = Q.defer();
        self.cache.set(key, value, function (err, success) {
            if (err || !success) {
                deferred.reject(err);
            } else {
                deferred.resolve(success);
            }
        });
        return deferred.promise;
    };

    self.containsKey = function (key) {
        var deferred = Q.defer();
        self.cache.keys(function (err, keys) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(_.contains(keys, key));
            }
        });
        return deferred.promise;
    };
}