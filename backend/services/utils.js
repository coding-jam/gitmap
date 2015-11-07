var Q = require('q');

String.prototype.capitalize = String.prototype.capitalize || function(){
    return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

Q.each = Q.each || function(array, callback) {
    var promises = [];
    array.forEach(function(item, i) {
        var deferred = Q.defer();
        callback(deferred, item, i);
        promises.push(deferred.promise);
    });
    return Q.all(promises);
}