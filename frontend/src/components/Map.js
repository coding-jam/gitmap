import React from "react";
import _ from "lodash";
import MAP_OPTIONS from "src/model/MAP_OPTIONS";
import GMaps from "gmaps";
import locations from "src/model/Locations";

var clearMarkers = (markerObjects) => {
	_.each(markerObjects, function(m) {
		m.setMap(null);
	});
}

export default class Map extends React.Component {

	constructor(props) {
		super(props);
		
		this.lastRenderedMarkers = [];
		this.markerObjects = [];
		this.map = null;

		this.renderMap = this._renderMap.bind(this);
	}

	componentDidMount() {

		var options = Object.assign(
			{
				el:React.findDOMNode(this.refs.chart),
				zoom_changed:() => this.props.changeZoom(this.map.getZoom())
			},
			MAP_OPTIONS
		);

		this.map = new GMaps(options);

	}

	_renderMap(){
		if(this.map && this.props.markers !== this.lastRenderedMarkers){

			var that = this;

			clearMarkers(this.markerObjects);

			this.markerObjects = [];

			_.each(this.props.markers, function(m) {
			
				var markerObject;

				if (m.usersCount > 0) {
					markerObject = that.map.addMarker({
						lat:m.coordinates.lat,
						lng:m.coordinates.lng,
						animation: google.maps.Animation.DROP,
						details:m,
						icon: "http://chart.apis.google.com/chart?chst=d_map_spin&chld=1|0|FF0000|12|_|" + m.usersCount,
						click:(() => {
							if(m.countryKey){
								locations.getCountries().then(countries => {
									let country = countries[m.countryKey];
									that.map.fitLatLngBounds([
										new google.maps.LatLng(country.bounds.northeast.lat,country.bounds.northeast.lng),
										new google.maps.LatLng(country.bounds.southwest.lat,country.bounds.southwest.lng)
									])

									that.props.markerClick(m);
								});	
							}else{
								that.props.markerClick(m);
							}
						})
					});

					that.markerObjects.push(markerObject);
				}
			});
			
			this.lastRenderedMarkers = this.props.markers;	
		}
	};

	render() {

		this.renderMap();

		return (
			<div>
				<div className="Map" ref = "chart">
				</div>
			</div>
		);
	}
}