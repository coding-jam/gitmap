import React from "react";

export default class Loader extends React.Component {
	render() {
		return ( 
			<div className={'Loader ' + (this.props.show ? 'show' : 'hidden')}>		
      		</div>
		);
	}
}