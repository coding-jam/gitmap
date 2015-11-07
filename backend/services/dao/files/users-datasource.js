var _ = require("underscore");
var fs = require('fs');
var Q = require('q');

var usersDs = {

    data: {
        folder: __dirname + '/../../../data/',
        usersFolder: '_users'
    },

    getUsers: function (country) {
        if (users[country]) {
            return users[country];
        } else {
            return Q.reject('Country unknown!');
        }
    },

    findBy: function (country, locations, languages) {
        var normalizedLanguages = toLowerCase(languages);
        return usersDs.getUsers(country)
            .then(function (users) {
                return _.chain(users.items)
                    .filter(function (user) {
                        return user.location && _.contains(locations, user.location.toLowerCase());
                    })
                    .filter(function (user) {
                        if (normalizedLanguages) {
                            return hasLanguages(user, normalizedLanguages);
                        } else {
                            return true;
                        }
                    })
                    .value();
            })
            .then(function (filtered) {
                return {
                    total_count: filtered.length,
                    items: filtered
                }
            });

        function toLowerCase(array) {
            if (array && array.length) {
                return _.chain(array)
                    .map(function (value) {
                        return value.toLowerCase().trim();
                    })
                    .filter(function (value) {
                        return !!value;
                    })
                    .value();
            } else {
                return array;
            }
        }

        function hasLanguages(user, languages) {
            // Se l'intersezione delle liste ha la stessa lunghezza di languages, languages è contenuta in user.languages
            return _.intersection(languages, toLowerCase(user.languages)).length == languages.length;
        }
    },

    getCreationDate: function (country) {
        return Q.nfcall(fs.stat, usersDs.data.folder + country + usersDs.data.usersFolder)
            .then(function (data) {
               return data.birthtime;
            });
    }
};

var users = [];
users['it'] = loadUsers('it');
users['uk'] = loadUsers('uk');
users['sp'] = loadUsers('sp');
users['fr'] = loadUsers('fr');
users['ge'] = loadUsers('ge');

function loadUsers(country) {
    var users = {
        total_count: 0,
        items: []
    };

    var deferred = Q.defer();
    fs.readdir(usersDs.data.folder + country + usersDs.data.usersFolder, function (err, files) {
        if (err || files.length == 0) {
            deferred.reject(err || 'No data!');
        } else {
            var promises = [];
            files.forEach(function (file) {
                if (file.match('\.json$')) {
                    var deferredLoop = Q.defer();
                    var filePath = usersDs.data.folder + country + usersDs.data.usersFolder + '/' + file;
                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            deferredLoop.reject(err);
                        } else {
                            var json = JSON.parse(data);
                            users.total_count += json.total_count;
                            users.items = users.items.concat(json.items);
                            deferredLoop.resolve();
                        }
                    });
                    promises.push(deferredLoop.promise);
                }
            });
            Q.all(promises)
                .then(function () {
                    var usersWithLanguage = _.filter(users.items, function (user) {
                        return user.languages && user.languages.length > 0;
                    });
                    console.log(users.total_count + ' ' + country.toUpperCase() + ' users loaded, ' + usersWithLanguage.length + ' with languages');
                    //deferred.resolve({
                    //    total_count: usersWithLanguage.length,
                    //    items: usersWithLanguage
                    //});
                    deferred.resolve(users);
                })
                .catch(function (err) {
                    deferred.reject(err);
                });
        }
    });
    return deferred.promise;
}

module.exports = usersDs;