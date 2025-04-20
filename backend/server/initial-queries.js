//Hele lelijke manier om de initiele query uit te voeren en dummy data erin te zetten

const csvDir = './dummydata/'
const fileNames = [csvDir + 'actor.csv', csvDir + 'category.csv', csvDir + 'director.csv', csvDir + 'movie_actor.csv', csvDir + 'movie.csv', csvDir + 'watched.csv'];

const csv = require('csv-parser');
const fs = require('fs');

export const initialQuery = `
 
CREATE TABLE IF NOT EXISTS director(
    director_id INTEGER PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS actor(
    actor_id INTEGER PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS category(
    category_id INTEGER PRIMARY KEY,
    category_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS movie (
    movie_id INTEGER PRIMARY KEY, 
    category_id INTEGER,
    director_id INTEGER,
    movie_title VARCHAR(255),
    image BLOB,
    description TEXT,
    release_year INTEGER,
    score INTEGER,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL,
    FOREIGN KEY (director_id) REFERENCES director(director_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS movie_actor(
    movie_id INTEGER,
    actor_id INTEGER,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actor(actor_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watchlist(
    movie_id INTEGER,
    watched INTEGER(1),
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id) ON DELETE CASCADE
);
`;


class Actor{
    constructor(id, firstName, lastName){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

class Director{
    constructor(id, firstName, lastName){
        this.id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

class Category{
    constructor(id, categoryName){
        this.id = id;
        this.categoryName = categoryName;
    }
}

class Movie{
    constructor(id, categoryID, directorID, title, image, description, releaseYear, score){
        this.id = id;
        this.categoryID = categoryID;
        this.directorID = directorID;
        this.title = title;
        this.image = image;
        this.description = description;
        this.releaseYear = releaseYear;
        this.score = score;
    }
}

class MovieActor{
    constructor(movieId, actorId){
        this.movieId = movieId;
        this.actorId = actorId;
    }
}

class Watched{
    constructor(movieId, watched){
        this.movieId = movieId;
        this.watched = watched;
    }
}

function getActorData(){

    let data = [];

    fs.createReadStream(fileNames[0])

}