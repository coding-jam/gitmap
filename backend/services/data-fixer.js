var usersDs = require('./dao/files/users-datasource');
var Q = require('q');
var fs = require('fs');
var _ = require("underscore");


var fixer = {

    runFixUsers: function (country) {

        var deferred = Q.defer();
        Q.nfcall(fs.readdir, usersDs.data.folder + country + '_users')
            .then(function (files) {
                fixFile(files, country, 0, deferred);
            })

        return deferred.promise;

        function fixFile(files, country, i, deferred) {

            if (i >= files.length) {
                return deferred.resolve();

            } else if (files[i].match('\.json$')) {
                var file = files[i];
                var filePath = usersDs.data.folder + country + '_users/' + file;
                console.log('Processing file ' + file);
                Q.nfcall(fs.readFile, filePath, 'utf8')
                    .then(function (data) {
                        var users = JSON.parse(data);
                        return fixer.fixUserDetails(users)
                    })
                    .then(function (users) {
                        return Q.nfcall(fs.writeFile, filePath, JSON.stringify(users))
                    })
                    .then(function () {
                        console.log(file + ' updated');
                        return fixFile(files, country, ++i, deferred);
                    })
                    .catch(function (err) {
                        return deferred.reject(err);
                    });
            } else {
                return fixFile(files, country, ++i, deferred);
            }
        }
    },

    fixUserDetails: function (users) {
        users.items.forEach(function (user) {

            // Sort languages
            if (user.languages && user.languages.length > 0) {
                user.languages = user.languages.sort();
            }

            //Blog fix
            if (user.blog && !user.blog.toLowerCase().match('^http(s)?://')) {
                console.log('Correggo ' + user.blog + ' in http://' + user.blog);
                user.blog = 'http://' + user.blog;
            }
        });

        users.total_count = users.items.length;

        return users;
    }
}

module.exports = fixer;

fixer.runFixUsers(process.argv[2])
    .catch(console.error);