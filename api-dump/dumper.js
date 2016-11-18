#!/usr/bin/env node
var request = require("request-promise");
require('colors');
var fs = require('fs');

var configs = [
    {
        api: "/countries",
        file: "data-countries.json"
    },
    {
        api: "/users",
        file: "data-users.json"
    },
    {
        api: "/users/fr",
        file: "data-users-fr.json"
    },
    {
        api: "/users/it",
        file: "data-users-it.json"
    },
    {
        api: "/users/uk",
        file: "data-users-uk.json"
    },
    {
        api: "/users/sp",
        file: "data-users-sp.json"
    },
    {
        api: "/users/ge",
        file: "data-users-ge.json"
    },
    {
        api: "/locations/fr",
        file: "data-locations-fr.json"
    },
    {
        api: "/locations/it",
        file: "data-locations-it.json"
    },
    {
        api: "/locations/uk",
        file: "data-locations-uk.json"
    },
    {
        api: "/locations/sp",
        file: "data-locations-sp.json"
    },
    {
        api: "/locations/ge",
        file: "data-locations-ge.json"
    }
];

if (process.argv.length == 3) {
    var url = process.argv[2];
    var baseUrl = 'http://' + url + '/api/v1';

    configs.forEach(function (conf) {
        request(baseUrl + conf.api)
            .then(function (resp) {
                writeTo(conf.file, resp);
            });
    });

} else {
    console.log("Missing required base url".red);
}

function writeTo(file, data) {
    fs.writeFile(file, data, function (err) {
        if (err) {
            throw new Error(err);
        }
    });
}
