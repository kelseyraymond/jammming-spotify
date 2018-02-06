import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    handleTermChange(event) {
        this.props.onSearch(event.target.value);
    }

	render() {
		return (
			<div className="SearchBar">
			  <input 
                onChange={this.handleTermChange}
                placeholder="Enter A Song, Album, or Artist" />
			  <a>SEARCH</a>
			</div>
		)
	}
}

export default SearchBar;