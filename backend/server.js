#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs = require('fs');
var _ = require('underscore');

var users = require(__dirname + '/routes/users');
var languages = require(__dirname + '/routes/languages');
var locations = require(__dirname + '/routes/locations');
var countries = require(__dirname + '/routes/countries');
var countryMapping = require(__dirname + '/services/country-mappings');
var api = require(__dirname + '/services/api-params');
var inputValidators = require(__dirname + '/routes/middlewares/input-validators');
var memoryCache = require(__dirname + '/routes/middlewares/memory-cache');

/**
 *  Define the sample application.
 */
var SandboxApp = function() {

    //  Scope.
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        //if (typeof self.zcache === "undefined") {
        //    self.zcache = { 'index.html': '' };
        //}
        //
        ////  Local cache for static content.
        //self.zcache['index.html'] = fs.readFileSync('./frontend/index.html');

        //return dataCollector.collectUsers().catch(function(err) {throw err});
        //return dataCollector.collectUserDetails().catch(function(err) {throw err});
        //return dataCollector.collectLocations()
        //    .then(function(locations) {
        //        console.log(locations.length + ' locations known');
        //        //dataCollector.collectItalianRegions();
        //    });
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', /*'SIGUSR2',*/ 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        //self.routes = { };
        //
        //self.routes['/asciimo'] = function(req, res) {
        //    var link = "http://i.imgur.com/kmbjB.png";
        //    res.send("<html><body><img src='" + link + "'></body></html>");
        //};
        //
        //self.routes['/'] = function(req, res) {
        //    res.setHeader('Content-Type', 'text/html');
        //    res.send(self.cache_get('index.html') );
        //};

        self.app.use(express.static(__dirname + '/../build'));

        self.app.use(inputValidators);
        self.app.use(memoryCache({
            useClones: false,
            checkperiod: 0,
            cacheAll: true
        }));

        self.app.use(api.getApiPath() + api.usersPath, users);
        self.app.use(api.getApiPath() + api.languagesPath, languages);
        self.app.use(api.getApiPath() + api.locationsPath, locations);
        self.app.use(api.getApiPath() + api.countriesPath, countries);

        // catch 404 and forward to error handler
        self.app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        self.app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: {}
            });
        });
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.app = express();
        //self.createRoutes();
        //
        ////  Add handlers for the app (from the routes).
        ////for (var r in self.routes) {
        ////    self.app.get(r, self.routes[r]);
        ////}
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache()
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
        self.createRoutes();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SandboxApp();
zapp.initialize();
zapp.start();

