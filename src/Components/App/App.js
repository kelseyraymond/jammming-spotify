import React from 'react';
import '../../reset.css';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    };
  }

  addTrack(track) {
    const trackIsInPlaylist = this.state.playlistTracks.some(playlistTrack =>
      playlistTrack.id === track.id
    );
    if (!trackIsInPlaylist) {
      this.setState({
        playlistTracks: this.state.playlistTracks.concat([track])
      });
    }
  }

  removeTrack(track) {
    const newPlaylistTracks = this.state.playlistTracks.filter(playlistTrack =>
      playlistTrack.id !== track.id
    );
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  updatePlaylistName(name) {
    this.setState({ 
      playlistName: name
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs)

    this.setState({
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    });
  }

  search(searchTerm) {
    if (searchTerm) {
      Spotify.search(searchTerm).then(foundTracks => {
        this.setState({
          searchResults: foundTracks
        });
      });
    }
    else {
      this.setState({
        searchResults: []
      });
    }
  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar 
            searchResults={this.state.searchResults}
            onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              onAdd={this.addTrack}
              searchResults={this.state.searchResults} />
            <Playlist 
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onRemove={this.removeTrack} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
