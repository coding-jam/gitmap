import http from "src/model/Http";
import _ from "lodash";
import q from "q";

var countries = null;
var districts = {};

var getAllDistricts = () => {
	return getCountries().then((countries) => {
		let districts = [];
		let countryPromises = _.map(_.keys(countries),(country)=>{
			return getDistricts(country);
		});

		return q.all(countryPromises).then((results) => {
			return _.flatten(results);
		});
	});
};

var getDistricts = (country) => {
	let loadPromise = () => {
		return http.get('/api/v1/locations/' + country).then(function(response){
			districts[country] = _.map(response.districts,function(district){
				return {
					country:country,
					name:district.district,
					//coordinates: district.details.results[0].geometry.location
					coordinates: district.details.geometry.location
				};
			});

			return districts[country];

		}).catch(() => []);
	};

	return districts[country] ? q(districts[country]) : loadPromise();
};

var getCountries = function(){
	let loadPromise = () => {
		return http.get('/api/v1/countries').then(function(response){

			countries = {};

			_.each(_.keys(response.continents.europe.countries),function(key){
				var country = response.continents.europe.countries[key];
				countries[key] = {
					name:country.name,
					coordinates: country.geometry.location,
					bounds:country.geometry.viewport
				};
			});

			return countries;
		});
	};

	return countries ? q(countries) : loadPromise();
};

export default {
	getCountries:getCountries,
	getDistricts:getDistricts,
	getAllDistricts:getAllDistricts
};