var gulp = require('gulp');
var connect = require('gulp-connect');
var rename = require("gulp-rename");
var del = require('del');
var shell = require('gulp-shell');

var serve = function(build){
    connect.server({
        livereload: true,
        port: 8000,
        root: build ? '../build' : '.',
        middleware: function(connect,o){
            return [
                (function() {
                    var url = require('url');
                    var proxy = require('proxy-middleware');
                    var options = url.parse('http://localhost:8080/api/');
                    options.route = '/api/';
                    return proxy(options);
                })()
            ]
        }
    });

    require('../backend/server');   
};

gulp.task('serve', function () {
    serve(false);
});

gulp.task('clear', function() {
    del(['./../build/**/*'], {force: true});
});

gulp.task('build', ['clear'], function () {

    gulp.src('./images/**')
        .pipe(gulp.dest('./../build/images'));

    gulp.src('./css/**')
        .pipe(gulp.dest('./../build/css'));

    gulp.src('./index_prod.html')
        .pipe(rename("index.html"))
        .pipe(shell(['jspm bundle-sfx src/main ../build/app.js']))
        .pipe(gulp.dest('./../build'));
});

gulp.task('serve-build', ['build'], function () {
    serve(true);
});