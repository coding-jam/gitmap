import _ from "lodash";
import Locations from "src/model/Locations";
import users from "src/model/Users";

var startLoading = function(){
	return {
		actionType: "loadingStart"
	};
};

var endLoading = function(){
	return {
		actionType: "loadingEnd"
	};
};

var userByLocationLoaded = function(users,params){
	return Object.assign({},params,{
		actionType: "userByLocationLoaded",
		users:users
	});
};

var getUsersByDistrict = function(params){
	return function(dispatch){
		dispatch(startLoading());
		return users.getUsersByDistrict(params).then(function(users){
			dispatch(userByLocationLoaded(users,params));
			return users;
		});
	};
};

var loadMarkers = (districtMode,query) => {

	var params = {
		districtMode:districtMode,
		query:query
	};

	return function(dispatch){
		dispatch(startLoading());
		return users.count(params).then(function(markers){
			dispatch(markersLoaded(markers,query,districtMode));
			return markers;
		});
	};
};

var markersLoaded = function(markers,query,districtMode){
	return {
		actionType: "markersLoaded",
		districtMode:districtMode,
		markers:markers,
		query:query
	};
};

var closeUserDialog = () => {
	return {
		actionType:'closeUserDialog'
	}
};

export default {
	getUsersByDistrict: getUsersByDistrict,
	loadMarkers:loadMarkers,
	closeUserDialog:closeUserDialog
};