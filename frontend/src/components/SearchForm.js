import React from "react";
import Actions from "src/Actions";
import _ from "lodash";

var checkUsers = function(locations){
	var totalUsers = _.reduce(locations, function(memo, location){ return memo + location.usersCount; }, 0);
	return totalUsers > 0;
};

export default class SearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.search = this._search.bind(this);
		this.onKeypress = this._onKeypress.bind(this);
	}

	_search(){
		this.props.search(React.findDOMNode(this.refs.querySearch).value).then(data => {
			if(data.length > 0 && !checkUsers(data)){
				swal("Nessun utente corrisponde alla ricerca!");
			};
		});
	};

	_onKeypress(e){
		if (e.charCode === 13) {
			this.search();
        	return false;
    	}
	};

	render() {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
		      <div className="container">
		        <div className="navbar-header">
		          <a className="navbar-brand" href="#">Git-Map</a>
		        </div>
		        <form className="navbar-form navbar-right" role="search">
			        <div className="form-group">
			          <input 
			          	ref="querySearch" 
			          	type="text" 
			          	className="form-control" 
			          	onKeyPress={this.onKeypress}
			          	placeholder="Search by language..."></input>
			        </div>
			        <button 
			        	type="button"
			        	onClick={this.search}
			        	className="btn btn-default">Search</button>
		      	</form>
		      </div>
		    </nav>
		);
	}
}