import React from "react";
import UserImage from "src/components/UserImage";

export default class UserListRow extends React.Component {
	constructor(props) {
		super(props);
		this.renderRows = this._renderRows.bind(this);
	}

	renderLanguages(languages) {
		if(!languages || !languages.length){
			return "";
		}

		return languages.map((l,i) => {
			return <li key={i}>{l}</li>
		});
	}

	_renderRows(){
		return this.props.userPair.map(function(user,i){
			return (
			<div>
				<div className="col-md-1 col-xs-3">
					<a href={user.html_url} target="_blank">
						<UserImage url={user.avatar_url}/>
					</a>
				</div>
				<div className="col-md-5 col-xs-9">
					<dl>
						<dt>
							<a href={user.html_url} target="_blank">
								<h3 className="NoPadding">{user.login}</h3>
							</a>
						</dt>
						<dd className={user.name ? 'show' : 'hidden'}>
							{user.name}
						</dd>
						<dd className={user.blog ? 'show' : 'hidden'}>
							<a target="_blank" href={user.blog}>{user.blog}</a>
						</dd>
						<dd className={user.languages.length ? 'show' : 'hidden'}>
							<ul className="list-inline">
								{this.renderLanguages(user.languages)}
							</ul>
						</dd>
						<dd className={user.location ? 'show' : 'hidden'}>
							<i>{user.location}</i>
						</dd>
					</dl>
				</div>
			</div>);
		},this);
	};

	render() {

		var rows = this.renderRows();

		return (
			<div className={'row UserRow ' + (this.props.even ? 'Even' : 'Odd')}>
				{rows}
			</div>
		);
	}
}