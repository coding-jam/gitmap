var Q = require('q');
var db = require('./mongo-connection');

function executeQuery(db) {
    return db.collection('countries')
        .find({}, {_id: false})
        .toArray()
        .then(function (countries) {
            return countries[0];
        })
}

var countriesDs = {

    /**
     * Return continents and related countries
     *
     * @param dbRef [optional]
     * @returns {Promise}
     */
    getCountriesLocations: function(dbRef) {
        if (dbRef) {
            return Q.when(executeQuery(dbRef));
        } else {
            return Q.when(db().then(function (db) {
                return executeQuery(db)
                    .then(function (countries) {
                        db.close();
                        return countries;
                    })
            }));
        }
    }

};

module.exports = countriesDs;