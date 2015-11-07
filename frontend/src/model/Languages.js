import jQuery from "jquery";
import _ from "lodash";

var getLanguagesPerCountries = () => {
	return jQuery.get('/api/v1/languages').then((response) => {
		return response.languagesPerCountries;
	});
};

var listAll = (sortByName) => {
	return getLanguagesPerCountries().then((languagesPerCountries) => {
		var result = {};
		
		_.each(languagesPerCountries,function(countryData){
			_.each(countryData.languages,function(languageInfo){
				result[languageInfo.language] = (result[languageInfo.language] || 0) + languageInfo.usersPerLanguage;
			});
		});

		result = _.pairs(result);

		result = _.sortBy(rawData,function(row){
			return sortByName ? row[0] : row[1]
		});

		return _.map(result,function(row){
			return row[0];
		});

	});
};

export default {
	listAll:listAll,
	getLanguagesPerCountries:getLanguagesPerCountries
};