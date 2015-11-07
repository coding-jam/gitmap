var languagesAdapter = require('../../../../services/adapters/mongodb/languages-adapter');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Languages Mongo Adapter Test suite', function () {

    this.timeout(100000);
    this.slow(250000);

    describe('getRankedLanguages', function () {

        it('should return all languages used in Italy order by most used', function (done) {

            languagesAdapter.getRankedLanguages('it')
                .then(expectedAssertions)
                .done(done);
        });

        it('should return all languages used in Uk order by most used', function (done) {

            languagesAdapter.getRankedLanguages('uk')
                .then(expectedAssertions)
                .done(done);
        });

        it('should return all languages used in Tuscany (Italy) order by most used', function (done) {

            languagesAdapter.getRankedLanguages('it', 'toscana')
                .then(expectedAssertions)
                .done(done);
        });

        it('should return all languages used in West Yorkshire (Uk) order by most used', function (done) {

            languagesAdapter.getRankedLanguages('uk', 'west yorkshire')
                .then(expectedAssertions)
                .done(done);
        });

        function expectedAssertions(languages) {
            expect(languages).not.null;
            expect(languages).to.be.a('array');
            expect(languages).to.have.deep.property('[0].language');
            expect(languages).to.have.deep.property('[1].usersPerLanguage');
            expect(_.first(languages).usersPerLanguage).to.be.above(_.last(languages).usersPerLanguage);
        }
    });

    describe('getLanguagesPerDistrict', function () {

        it('should return languages per Italian regions', function(done) {

            languagesAdapter.getLanguagesPerDistrict('it')
                .then(function(languages) {
                    expect(languages).to.be.not.null;
                    expect(languages).to.have.property('languagesPerDistricts');
                    expect(languages.languagesPerDistricts).to.be.a('array');
                    expect(languages.languagesPerDistricts).to.have.length(20);
                    expect(languages.languagesPerDistricts).to.have.deep.property('[0].districtName', 'Abruzzo');
                    expect(languages.languagesPerDistricts).to.have.deep.property('[0].languages');
                })
                .done(done);
        });

        it('should return languages per Uk districts', function(done) {

            this.timeout(0);
            setTimeout(done, 1000000);

            languagesAdapter.getLanguagesPerDistrict('uk')
                .then(function(languages) {
                    expect(languages).to.be.not.null;
                    expect(languages).to.have.property('languagesPerDistricts');
                    expect(languages.languagesPerDistricts).to.be.a('array');
                    expect(languages.languagesPerDistricts).to.have.length(147);
                    expect(languages.languagesPerDistricts).to.have.deep.property('[0].districtName', 'Aberdeenshire');
                    expect(languages.languagesPerDistricts).to.have.deep.property('[0].languages');
                })
                .done(done);
        });

    });

    describe('getLanguagesPerCountry', function () {

        it('should return languages per countries', function(done) {

            languagesAdapter.getLanguagesPerCountry()
                .then(function(languages) {
                    expect(languages).to.be.not.null;
                    expect(languages).to.have.property('languagesPerCountries');
                    expect(languages.languagesPerCountries).to.be.a('array');
                    expect(languages.languagesPerCountries).to.have.length(5);
                    expect(languages.languagesPerCountries).to.have.deep.property('[0].countryName', 'France');
                    expect(languages.languagesPerCountries).to.have.deep.property('[0].countryKey', 'fr');
                    expect(languages.languagesPerCountries).to.have.deep.property('[0].languages');
                })
                .done(done);
        });

    });
});