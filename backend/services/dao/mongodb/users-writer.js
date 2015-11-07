#!/usr/bin/env node
var _ = require('underscore');
var usersDs = require('../files/users-datasource');
var countries = _.keys(require('../../country-mappings').countryShortName);
var db = require('./mongo-connection');
//db.getCollection('it_users').find({'languages.0' : {$exists: true}})

function adaptData(users, country) {
    return usersDs.getCreationDate(country)
        .then(function (creationDate) {
            return _.map(users, function (user) {
                user.created_at = new Date(user.created_at);
                user.updated_at = new Date(user.updated_at);
                user.gitmap = {
                    creation_date: creationDate
                }
                return user;
            });
        })
}

countries.forEach(function (country) {
    usersDs.getUsers(country)
        .then(function (users) {
            return adaptData(users.items, country);
        })
        .then(function (users) {
            db().then(function (db) {
                console.log('Starting writing ' + country.toUpperCase() + ' users');
                db.collection(country + '_users')
                    .insertMany(users)
                    .then(function (result) {
                        console.log(result.insertedCount + ' users inserted of country ' + country.toUpperCase());
                        db.close();
                    })
                    .catch(console.error);
            })
        });
})
