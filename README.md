# sandbox
CNJ Sandbox

# Pre-requirements #
This project is based on [Node.js](https://nodejs.org/), [Gulp](http://gulpjs.com/) for building and [jspm.io](http://jspm.io/) for frontend dependencies. 

So you need to:

* [download](https://nodejs.org/download/) and install Node.js
* install global dependencies:
```
npm install jspm -g
```
```
npm install gulp -g
```

# How to build #

This project is composed by two parts:

* **frontend**
* **backend**

## Frontend: dependencies and build ##

From root folder, type:
```
cd frontend
```
```
npm install
```
```
jspm install
```
```
gulp build
```


## Backend: dependencies and run ##

From root folder, type:
```
cd backend
```
```
npm install
```
```
sudo chmod u+x server.js
```
```
node server.js
```

Enjoy on http://localhost:8080

# API details #
## Entry-point ##
API entry-point is 

```
/api/v1/countries
```

contains links to furthers APIs' endpoints.
This endpoint provides countries geolocation info with geometric boundaries. " *links* " section contains country details with specific endpoints, i.e.

```
/api/v1/countries/it
```
which provides API endpoints for **users**, **locations** and **languages** of current country, or aggregated users' info per Country:

```
/api/v1/users
```

Available country short-name are:

* **it**: Italy
* **uk**: United Kingdom
* **sp**: Spain
* **fr**: France

Let's assume to choose Italy, each following endpoint is country-based.

## Users endpoint ##

```
/api/v1/users/it
```

The main information provided by this service is " *usersInLocations* ": represents the number of users per **District** (Regions in Italy). 
Each entry provides two extra navigable links:
 
* *usersDetails*: users details per district, i.e.
    
    ```
    /api/v1/users/it/toscana
    ```
    
    This endpoint provides detailed information on GitHub users, including *location details and coordinates*.

* *languages*: languages details per district, i.e.

    ```
    /api/v1/languages/it/toscana
    ```
    
    This endpoint provides information on programming languages, *ranked by users who know that languages* in that district.
    
    It also accept a query param " *languages* " which enables a filter based on a comma list of programming languages (case insensitive):
    
    ```
    /api/v1/languages/it/toscana?languages=Java,python
    ```
    
    
This API endpoint provides a *links* object for accessing further more APIs for current country (same as country level):

## Languages endpoint ##
    
```
/api/v1/languages/it
```

Provides all programming languages ranked by users in Italy.
This service provides two more links:

* *languagesPerDistrict*: provides languages grouped by italian districts

    ```
    /api/v1/languages/it/per-district
    ```

* *singleDistrict*: provides languages in a single italian district (same endpoint as *languages* in *usersInLocations* seen above)
    
    ```
    /api/v1/languages/it/toscana
    ```
    
## Languages endpoint ##

```
/api/v1/locations/it
```

Provides all Italian districts with geolocation details. This service can be useful to point clustered markers on each country district.
Geolocation information delimits a region area by providing two opposites corner coordinates (i.e. 'northeast', 'southwest').