//Hele lelijke manier om de initiele query uit te voeren en dummy data erin te zetten

import * as fs from 'fs';

const __dirname = import.meta.dirname;
const csvDir = __dirname + '/dummydata/';

const fileNames = [csvDir + 'actor.csv', csvDir + 'category.csv', csvDir + 'director.csv', csvDir + 'movie_actor.csv', csvDir + 'movie.csv', csvDir + 'watched.csv'];
const tableNames = ['actor', 'category', 'director', 'movie_actor', 'movie', 'watchlist'];

export const initialQuery = `
 
CREATE TABLE IF NOT EXISTS director(
    director_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS actor(
    actor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS category(
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS movie (
    movie_id INTEGER PRIMARY KEY AUTOINCREMENT, 
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
    movie_actor_id INTEGER PRIMARY KEY AUTOINCREMENT,
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

export async function insertDummyData(db) {
    for (let i = 0; i < fileNames.length; i++) {

        let fileName = fileNames[i];
        let tableName = tableNames[i];
        let parsedFile = null;

        try {
            parsedFile = await parseCSV(fileName);
        } catch (error) {
            console.log(error.message);
        }

        if (parsedFile) {

            parsedFile.forEach(element => {            
                let cols = Object.keys(element);
                let query = buildQuery(tableName, element, cols);
                try{
                    db.execute(query);

                }catch(error){                    
                    console.log(error + 'hallo');
                }
            });
        }
    }
}

function buildQuery(tableName, parsedFile, cols) {

    let query = `INSERT OR REPLACE INTO `  + tableName + ` (` + cols.join(', ')  + `) VALUES (`;

    for (let i = 0; i < cols.length; i++) {

        let value = parsedFile[cols[i]] || 'NULL';

        if (typeof value === 'string') {
            value = value.replace(/'/g, "''");

        }

        query += `'` + value + `'`;
        query += (i !== (cols.length - 1)) ? ',' : ');';
    }


    return query;

}

async function parseCSV(fileName) {

    //Terminal houdt niet van \r, dus hierin moest ik bij de lines dit vervangen
    try {

        let csv = await fs.readFileSync(fileName);
        const array = csv.toString().trim().split("\n").map(line => line.replace(/\r$/, ""));

        let result = [];
        let headers = array[0].split("---").map(header => header.replace(/\r$/, ""));

        for (let i = 1; i < array.length; i++) {
            let obj = {};
            let currentLine = array[i].split("---").map(value => value.replace(/\r$/, ""));

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j];
            }

            result.push(obj);
        }

        return result;

    } catch (error) {
        console.log(error.message);
    }
}