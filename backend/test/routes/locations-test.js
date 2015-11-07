var httpUtils = require('./http-utils');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Locations Routes Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function() {
        require('../../server');
    });

    describe('/locations/:country', function () {

        it('should return all italian locations info', function (done) {

            httpUtils.getUri('/locations/it')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.have.property('districts');
                    expect(resp.body.districts).is.a('array');
                    expect(resp.body.districts).to.have.length(20);
                    expect(resp.body.districts).to.have.deep.property('[0].district');
                    expect(resp.body.districts).to.have.deep.property('[0].details');
                    expect(resp.body.districts).to.not.have.deep.property('[0]._id');
                })
                .done(done);
        });

        it('should return all uk locations info', function (done) {

            httpUtils.getUri('/locations/uk')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.have.property('districts');
                    expect(resp.body.districts).is.a('array');
                    expect(resp.body.districts).to.have.length(147);
                })
                .done(done);
        });

    });

});
