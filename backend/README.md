# sandbox backend
CNJ Sandbox

# How to collect data for new country #

First start with row data stored to file system

## Country localization ##

* Add country acronym ([country] so on) to *backend/services/country-mappings.js* (so far *language* and *location*)
* Run 

    ```
    ./backend/collector-runner.js countries
    ```
    
    to update *backend/countries.json*

## Collect users info ##

Users' insformation are collected in two steps:

* Create folder *backend/data/[country]_users*
* Run

    ```
    ./backend/collector-runner.js users [country]
    ```
     
     to collect basic info
* Run
 
    ```
    ./backend/collector-runner.js details [country]
    ```
    
    to add languages and locations info
    
* Edit *backend/services/dao/files/users-datasource.js* to add new country's users

## Collect locations info ##

Now it's time geolocalize users' location asking Google Geolocator

* Run
 
    ```
    ./backend/collector-runner.js locations [country]
    ```
    
* Add new file *backend/data/[country]_locations.json* to *backend/services/dao/files/locations-datasource.js*

## Collect Country districts ##

Now extract districts from *backend/data/[country]_locations.json*: determinate which **administrative_level** 
represents district and fill *backend/services/country-mappings.js* (both *districtLevel* and *districtMinShortNameLength*)

* Run
 
    ```
    ./backend/collector-runner.js districts [country]
    ```
    
    to create  *backend/data/[country]_districts.json*
    

# How to persist new data to MongoDB #

* Run
 
    ```
    ./backend/services/dao/mongodb/countries-writer.js
    ```
    ```
    ./backend/services/dao/mongodb/users-writer.js
    ```
    ```
    ./backend/services/dao/mongodb/districts-writer.js
    ```
    ```
    ./backend/services/dao/mongodb/add-locations-to-users.js
    ```
    
# How to dump and restore MongoDB #
 
* From localhost run:

    ```
    mongodump --db=gitmap --host=127.0.0.1:27017
    ```
    
    which output is a **dump** folder containings **gitmap** folders and dump files

* Copy **dump** folder to Openshift and run:

    ```
    mongorestore --host $OPENSHIFT_MONGODB_DB_HOST --username $OPENSHIFT_MONGODB_DB_USERNAME --password $OPENSHIFT_MONGODB_DB_PASSWORD --drop
    ```
    
    out of **dump** folder
    

