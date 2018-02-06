const clientId = 'c7df0053c4cc46feb0b69a5f3c8d72d6';
const redirectUrl = 'http://localhost:3000/';
const spotifyAPI = 'https://api.spotify.com';

let accessToken;
let expiresIn;

const Spotify = {

    getAccessToken() {
        // check for access token -> success
        if (accessToken) {
            return accessToken;
        } else {
            let paramAccessToken = window.location.href.match(/access_token=([^&]*)/);
            let paramExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

            if (paramAccessToken) {
                accessToken = paramAccessToken[1];
                expiresIn = paramExpiresIn;
                window.setTimeout(() => accessToken = '', expiresIn[1] * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            } else {
                window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`
            }
        }
    },

    search(searchTerm) {
        return fetch(`${spotifyAPI}/v1/search?type=track&q=${searchTerm}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.getAccessToken()}`,
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed');
        }).then(jsonResponse => {
            if (jsonResponse.tracks) {
                return jsonResponse.tracks.items.map(track => {
                  return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                  }
                });
            } else {
                return [];
            }

        });
    },

    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs)
            return

        else {
            let headers = { 
                Authorization: `Bearer ${this.getAccessToken()}`,
            }; 
            let userID;
            let playlistID;

            // GET: grabbing the user's ID
            return fetch(`${spotifyAPI}/v1/me`, {
              headers: headers 
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('The UserID request has failed!');
            }).then(jsonResponse => {
                userID = jsonResponse.id
            })

            // POST: creating a new playlist
            .then(() => {
                return fetch(`${spotifyAPI}/v1/users/${userID}/playlists`, {
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify({
                    name: playlistName
                  })
                }).then(response => {
                    if (response.ok) {
                      return response.json();
                    }
                    throw new Error('The create playlist request has failed!');
                }).then(jsonResponse => {
                  playlistID = jsonResponse.id;
                  console.log(`${playlistID}`);
                })
            })

            // POST: adding the tracks to the new playlist we just made
            .then(() => {
                return fetch(`${spotifyAPI}/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        uris: trackURIs
                    })
                }).then(response => {
                    if (response.ok) {
                      return response.json();
                    }
                    throw new Error('The add tracks request has failed!');
                })
            })
        }
    }
}

export default Spotify;