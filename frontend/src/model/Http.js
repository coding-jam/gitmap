import jQuery from "jquery";
import q from "q";

var get = function(url){
	let deferred = q.defer();

	let options = {
		method:'GET',
		success:(response) => {
			deferred.resolve(response)
		},
		error:(jqXHR,textStatus,errorThrown) => {
			deferred.reject({
				status:textStatus,
				error:errorThrown
			})
		}
	};

	jQuery.ajax(url,options);

	return deferred.promise;
	
};

export default {
	get:get
};