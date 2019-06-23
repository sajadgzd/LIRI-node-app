require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");


var command = process.argv[2];

function concert(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(response) {
            // Name of the venue
            // Venue location
            // Date of the Event (use moment to format this as "MM/DD/YYYY")
            // console.log(response.data);
            console.log("Name of the venue:   ", response.data[0].venue.name);
            console.log("Name of the venue:   ", response.data[0].venue.city);
            console.log("Name of the venue:   ", response.data[0].datetime);

        })
        .catch(function(error) {
            console.log(error);
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function spotify(songName) {
    if (!songName) {
        songName = "The Sign";
    }
    console.log(songName);
    var spotify = new Spotify(keys.spotify);
    spotify
        .search({ type: 'track', query: songName, limit: 1 })
        .then(function(response) {
            for (let i = 0; i < response.tracks.items[0].album.artists.length; i++) {
                console.log("ARTISTS :::::: ", response.tracks.items[0].album.artists[i].name)
            }
            // console.log(response.tracks.items[0].artists[0].name);
            console.log("NAME of the SONG :::::: ", response.tracks.items[0].name);
            console.log("Preview :::::: ", response.tracks.items[0].preview_url);
            console.log("ALBUM :::::: ", response.tracks.items[0].album.name);
            // console.log("Artisttttttt :::::: ", response.tracks.items[0].album.artists);

        })
        .catch(function(err) {
            console.log(err);
        });

}

function movie(movieName) {
    if (!movieName) {
        movieName = "Mr. Nobody";
    }

    // Then run a request with axios to the OMDB API with the movie specified
    var omdbUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    axios.get(omdbUrl)
        .then(function(response) {
            console.log("TITLE:  ", response.data.Title);
            console.log("YEAR:  ", response.data.Year);
            console.log("IMDB Rating:  ", response.data.imdbRating);
            console.log("Rotten Tomato Rating:  ", response.data.Ratings[1].Value);
            console.log("Country:  ", response.data.Country);
            console.log("Language:  ", response.data.Language);
            console.log("Plot:  ", response.data.Plot);
            console.log("Actors:  ", response.data.Actors);
        })
        .catch(function(error) {
            console.log(error);
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function doIt() {
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var array = data.split(",");
        console.log(array);
        if (array[0] === "spotify-this-song") {
            spotify(array[1]);
        } else if (array[0] === "concert-this") {
            concert(array[1]);
        } else if (array[0] === "movie-this") {
            movie(array[1]);
        }
    })

}

switch (command) {
    case "concert-this":
        concert(process.argv[3]);
        break;
    case "spotify-this-song":
        spotify(process.argv[3]);
        break;
    case "movie-this":
        movie(process.argv[3]);
        break;
    case "do-what-it-says":
        doIt();
        break;
    default:
        console.log("Please provide a valid command");

}