import React from "react";
import $ from "jquery";

export default class UserImage extends React.Component {
	constructor(props) {
		super(props);
		this.loadComplete = this._loadComplete.bind(this);
	}

	_loadComplete(){
		$(React.findDOMNode(this.refs.userImage)).removeClass('hidden');
		$(React.findDOMNode(this.refs.dummyImage)).addClass('hidden');
	}

	render() {

		return (
			<div>
				<img 
					ref="userImage"
					className="img-responsive hidden"
					onLoad={this.loadComplete}
					src={this.props.url}>
				</img>
				<img 
					ref="dummyImage"
					className="img-responsive" 
					src="images/loader.svg">
				</img>
			</div>
		);
	}
}