import React from "react";
import * as bootstrap from "react-bootstrap";
import _ from "lodash";
import UserListRow from "src/components/UserListRow";

var Modal = bootstrap.Modal;

export default class UserList extends React.Component {
	constructor(props) {
		super(props);
		
		this.close = this._close.bind(this);
		this.listener = this._listener.bind(this);
		this.extendState = this._extendState.bind(this);
		this.renderRows = this._renderRows.bind(this);
		this.search = this._search.bind(this);
		this.onKeypress = this._onKeypress.bind(this);
	}

	_search(){
		this.props.search(React.findDOMNode(this.refs.querySearch).value);
	};

	_onKeypress(e){
		if (e.charCode === 13) {
			this.search();
        	return false;
    	}
	};

	_extendState(data){
		this.setState(_.extend(this.state, data));
	}

	_listener() {
		var data = _.extend(_.clone(Store.getData()),{showModal:true});
		this.extendState(data);
	}

	_close(){
		this.extendState({showModal:false});
	};

	_renderRows(){

		if(!this.props.users){
			return null;
		}

		var splittedUsers = _.chunk(this.props.users, 2);

		return splittedUsers.map(function(userPair,i){
			return (<UserListRow userPair={userPair} key={i} even={i % 2 === 0}></UserListRow>);
		});
	}

	render() {

		var rows = this.renderRows();

		return ( 
			<div>
				<Modal bsSize='large' show={this.props.showModal} onHide={this.props.closeModal}>
		          <Modal.Header closeButton>
		            	<Modal.Title>{this.props.location}</Modal.Title>
		          </Modal.Header>
		          <Modal.Body>
		          		<div className="container-fluid">
			          		<div className="row">
			          			<div className="col-xs-11">
		          					<input 
					          			className="form-control" 
					          			type="text" 
					          			ref="querySearch"
					          			onKeyPress={this.onKeypress}
					          			placeholder="Search by language..."
					          			defaultValue={this.props.initialQuery}></input>
			          			</div>
			          			<div className="col-xs-1">
			          				<button 
							        	type="button"
							        	onClick={this.search}
							        	className="btn btn-default">Search</button>
			          			</div>
			          		</div>
		          		</div>
		          		<div className="container-fluid NoPadding">
			            	{rows}
						</div>
		          </Modal.Body>
		        </Modal>
      		</div>
		);
	}
}