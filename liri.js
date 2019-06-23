require("dotenv").config();
var moment = require('moment');
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");


var command = process.argv[2];

var input = "";

for (let i = 3; i < process.argv.length; i++) {
    if (i === 3) {
        input = process.argv[3];
    } else {
        input += " " + process.argv[i];
    }
}

// console.log(input);

function concert(artist) {
    console.log(artist);
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function(response) {
            console.log("Name of the venue:   ", response.data[0].venue.name);
            console.log("Venue Location:   ", response.data[0].venue.city);
            console.log("Date of the Event:   ", moment(response.data[0].datetime).format("MM/DD/YYYY"));
            //adding to log.txt
            fs.appendFile("./log.txt", "Name of the venue:   " + response.data[0].venue.name + "\n" +
                "Venue Location:   " + response.data[0].venue.city + "\n" +
                "Date of the Event:   " + moment(response.data[0].datetime).format("MM/DD/YYYY") + "\n",
                function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });
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
            var arts = "";
            for (let i = 0; i < response.tracks.items[0].album.artists.length; i++) {
                console.log("ARTISTS :  ", response.tracks.items[0].album.artists[i].name)
                arts += response.tracks.items[0].album.artists[i].name;
            }
            // console.log(response.tracks.items[0].artists[0].name);
            console.log("NAME of the SONG :  ", response.tracks.items[0].name);
            console.log("Preview :  ", response.tracks.items[0].preview_url);
            console.log("ALBUM :  ", response.tracks.items[0].album.name);
            // adding to log.txt
            fs.appendFile("./log.txt", "Artists:   " + arts + "\n" +
                "NAME of the SONG:   " + response.tracks.items[0].name + "\n" +
                "Preview:   " + response.tracks.items[0].preview_url + "\n" +
                "ALBUM :   " + response.tracks.items[0].album.name + "\n",
                function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });

        })
        .catch(function(err) {
            console.log(err);
        });

}

function movie(movieName) {
    console.log(movieName);
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
            //adding to log.txt
            fs.appendFile("./log.txt", "TITLE:   " + response.data.Title + "\n" +
                "YEAR:   " + response.data.Year + "\n" +
                "IMDB Rating:   " + response.data.imdbRating + "\n" +
                "Rotten Tomato Rating :   " + response.data.Ratings[1].Value + "\n" +
                "Country:   " + response.data.Country + "\n" +
                "Language:   " + response.data.Language + "\n" +
                "Plot:   " + response.data.Plot + "\n" +
                "Actors :   " + response.data.Actors + "\n",
                function(err) {
                    if (err) {
                        return console.log(err);
                    }
                });


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
        // console.log(data);
        var array = data.split(",");
        console.log(array);
        if (array[0] === "spotify-this-song") {
            spotify(array[1]);
        } else if (array[0] === "concert-this") {
            concert(array[1]);
        } else if (array[0] === "movie-this") {
            movie(array[1]);
        }
    });

}

switch (command) {
    case "concert-this":
        concert(input);
        break;
    case "spotify-this-song":
        spotify(input);
        break;
    case "movie-this":
        movie(input);
        break;
    case "do-what-it-says":
        doIt();
        break;
    default:
        console.log("Please provide a valid command");

}