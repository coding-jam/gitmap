import React from "react";
import UserList from "src/components/UserList";
import SearchForm from "src/components/SearchForm";
import Loader from "src/components/Loader";
import Map from 'src/components/Map';
import { connect } from 'react-redux';
import Actions from "src/Actions";

const MIN_DISTRICT_MODE_ZOOM = 5;

class App extends React.Component{

	constructor(props) {
		super(props);
		this.search = this._search.bind(this);
		this.changeZoom = this._changeZoom.bind(this);
		this.markerClick = this._markerClick.bind(this);
		this.closeModal = this._closeModal.bind(this);
		this.modalSearch = this._modalSearch.bind(this);
	}

	_search(value){
		return this.props.dispatch(Actions.loadMarkers(this.props.map.districtMode,value));
	}

	_changeZoom(newZoom){
		var newDistrictMode = newZoom >= MIN_DISTRICT_MODE_ZOOM;
		if(this.props.map.districtMode !== newDistrictMode){
			this.props.dispatch(Actions.loadMarkers(newDistrictMode,this.props.users.lastQuery));	
		}
	}

	_markerClick(location){
		if(this.props.map.districtMode){
			this.props.dispatch(Actions.getUsersByDistrict({
				country:location.country,
				district:location.name,
				language:this.props.users.lastQuery
			}));
		}else{
			this.props.dispatch(Actions.loadMarkers(true,this.props.users.lastQuery));
		}
	}

	_modalSearch(language){
		this.props.dispatch(Actions.getUsersByDistrict({
			country:this.props.location.country,
			district:this.props.location.district,
			language:language
		}));
	}

	_closeModal(){
		this.props.dispatch(Actions.closeUserDialog());
	}

	componentDidMount(){
		this.props.dispatch(Actions.loadMarkers(false,this.props.users.lastQuery));
	}

	render() {
	    return (
	    	<div>
	    		<SearchForm 
	    			search={this.search}/>
				<Loader 
					show={this.props.loading.count > 0}/>
				<Map
					markerClick={this.markerClick} 
					changeZoom={this.changeZoom}
					markers={this.props.map.markers}/>
				<UserList 
					initialQuery={this.props.users.lastQuery}
					closeModal={this.closeModal}
					showModal={this.props.users.showUserModal}
					users={this.props.users.results}
					search={this.modalSearch}
					location={this.props.location.district}/>
			</div>
	    );
	}
};

var select = state => state;

export default connect(select)(App);