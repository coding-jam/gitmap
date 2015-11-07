var countriesDs = require('../../../../services/dao/mongodb/countries-datasource');
var expect = require('chai').expect;

describe('Countries Mongo Datasource Test suite', function () {

    this.timeout(100000);
    this.slow(250000);

    describe('getCountriesLocations', function () {

        it('should return all countries geo info', function (done) {

            countriesDs.getCountriesLocations()
                .then(function (countries) {
                    expect(countries).to.be.not.null;
                    expect(countries).to.be.a('object');
                    expect(countries).to.has.property('europe');
                    expect(countries).to.has.deep.property('europe.name', 'Europa');
                    expect(countries).to.has.deep.property('europe.geometry');
                    expect(countries).to.has.deep.property('europe.countries');
                    expect(countries.europe.countries).to.has.property('it');
                    expect(countries.europe.countries.it).to.has.property('name', 'Italia');
                    expect(countries.europe.countries.it).to.has.property('geometry');
                    expect(countries.europe.countries).to.has.property('uk');
                    expect(countries.europe.countries.uk).to.has.property('name', 'United Kingdom');
                    expect(countries.europe.countries.uk).to.has.property('geometry');
                    expect(countries.europe.countries).to.has.property('sp');
                    expect(countries.europe.countries.sp).to.has.property('name', 'España');
                    expect(countries.europe.countries.sp).to.has.property('geometry');
                    expect(countries.europe.countries).to.has.property('fr');
                    expect(countries.europe.countries.fr).to.has.property('name', 'France');
                    expect(countries.europe.countries.fr).to.has.property('geometry');
                })
                .done(done);
        });
    });

});