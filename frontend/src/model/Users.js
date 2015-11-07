import http from "src/model/Http";
import _ from "lodash";
import q from "q";
import locations from "src/model/Locations";
import languages from "src/model/Languages";


var countInAllDistricts = function(searchQuery){
	return locations.getCountries().then((countries) => {
		
		let countPromises = _.map(_.keys(countries),(country)=>{
			return countByCountry(country,searchQuery).catch(() => []);
		});

		return q.all(countPromises).then((results) => {
			return _.flatten(results);
		});
	});
};

var countByCountry = function(country,searchQuery) {
	let countPromise;
	if (!searchQuery) {
		countPromise = http.get('/api/v1/users/' + country).then(function(response) {
			var usersInLocations = response.usersInLocations;

			return locations.getDistricts(country).then(function(locations) {

				_.each(locations, function(location) {
					var currentUserLocation = _.find(usersInLocations, function(userLocation) {
						return userLocation.districtName === location.name;
					});

					location.usersCount = currentUserLocation ? currentUserLocation.usersCount : 0;
				});

				return locations;

			});
		});
	}else{
		countPromise = http.get('/api/v1/languages/' + country + '/per-district').then(function(response) {
			var languagesPerRegions = response.languagesPerDistricts;

			return locations.getDistricts(country).then(function(locations) {

				_.each(locations, function(location) {

					location.usersCount = 0;

					var currentLanguagesPerRegions = _.find(languagesPerRegions, function(languagePerRegions) {
						return languagePerRegions.districtName === location.name;
					});

					if(currentLanguagesPerRegions){
						var currentLanguage = _.find(currentLanguagesPerRegions.languages,function(language){
							return language.language.toUpperCase() === searchQuery.toUpperCase();
						});

						if(currentLanguage){
							location.usersCount = currentLanguage.usersPerLanguage;	
						}
						
					}
					
				});

				return locations;

			});
		});
	}

	return countPromise.catch(() => []);

};

var getUsersByDistrict = function(params){
	return http.get('/api/v1/users/' + params.country + '/' + params.district.toLowerCase()).then((response) => {
		var users = response.items;

		if(params.language){
			users = _.filter(users,function(user){

				return user.languages && _.find(user.languages,function(language){
					return language.toUpperCase() === params.language.toUpperCase();
				});
			});
		}

		return users;
	});
};

var countEurope = function(query){
	let currentUserPromise;
	if (query) {
		currentUserPromise = languages.getLanguagesPerCountries().then((languagesPerCountries) => {
			return _.map(languagesPerCountries, function(countryData) {
				let toReturn = _.pick(countryData, 'countryName', 'countryKey');
				
				let language = _.find(countryData.languages, function(languageInfo) {
					return languageInfo.language.toUpperCase() === query.toUpperCase();
				});

				toReturn.usersCount = language ? language.usersPerLanguage : 0;

				return toReturn;
			});
		});
	} else {
		currentUserPromise = http.get('api/v1/users').then(function(response) {
			return response.usersInCounties;
		});
	}

	return q.all([currentUserPromise,locations.getCountries()]).then((results) => {
		var [users,countries] = results;

		_.each(users,function(user){
			user.coordinates = countries[user.countryKey].coordinates;
		});

		return users;
	});
}

var count = function(params){
	return params.districtMode ? countInAllDistricts(params.query) : countEurope(params.query);
};

export default {
	getUsersByDistrict: getUsersByDistrict,
	count:count,
	countInAllDistricts:countInAllDistricts
};