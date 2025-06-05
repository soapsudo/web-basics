import Model from './model.js'
import DirectorModel from './director.js';
import ActorModel from './actor.js';

class MovieModel extends Model{

    constructor(db){
        super(db);
        this.director = new DirectorModel(db);
        this.actor = new ActorModel(db);
    }

    /**
    * Updates the existing movie entity record in the database, using the given NEW movie data.
    * 
    * @param {*} movieData - Object with the necessary data for a movie record to be added into the database.
    * @returns Object with the inserted movie data OR error object if it should happen.
    */
    async updateMovie(movieData){
        const actorNames = movieData.actors.split(',');

        let sql;
        let insert;

        try{
            const director = await this.director.getDirector(movieData.director_first_name, movieData.director_last_name);

            console.log(this.updateQuery())
            insert = await this.db.execute(this.updateQuery(), [movieData.category, director.director_id, movieData.movie_title, movieData.image, movieData.description, movieData.year, movieData.score, movieData.movie_id]);                 
                
        }catch(error){
            throw new Error(error.message);
        }
        
        try {

            let insertedMovieData = await this.db.fetchFirst(this.moviesQuery(movieData.movie_id, movieData.movie_title, 'a-z', `LEFT`));
            
            const insertedActorsForMovie = await this.actor.insertActorsForMovie(actorNames, insertedMovieData.movie_id);

            insertedMovieData = await this.db.fetchFirst(this.moviesQuery(null, movieData.movie_title));

            return insertedMovieData;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
    * Adds a new movie record to the database, using the given movie data.
    * 
    * @param {*} movieData - Object with the necessary data for a movie record to be added into the database.
    * @returns Object with the inserted movie data OR error object if it should happen.
    */

    async addMovie(movieData) {
        const actorNames = movieData.actors.split(',');

        let insert;

        try{
            const director = await this.director.getDirector(movieData.director_first_name, movieData.director_last_name);

            if (director && 'director_id' in director && director.director_id !== null && director.director_id !== undefined && director.director_id !== '') {
                insert = await this.db.execute(this.insertQuery(), [movieData.category, director.director_id, movieData.movie_title, movieData.image, movieData.description, movieData.year, movieData.score]);
                
            } else {
                const insertedDirector = await this.director.insertDirector(movieData.director_first_name, movieData.director_last_name);
                insert = await this.db.execute(this.insertQuery(), [movieData.category, insertedDirector.director_id, movieData.movie_title, movieData.image, movieData.description, movieData.year, movieData.score]);
            }

        }catch(error){
            throw new Error(error.message);
        }
        
        try {

            let insertedMovieData = await this.db.fetchFirst(this.moviesQuery(null, movieData.movie_title, 'a-z', `LEFT`));
        
            const insertedActorsForMovie = await this.actor.insertActorsForMovie(actorNames, insertedMovieData.movie_id);

            insertedMovieData = await this.db.fetchFirst(this.moviesQuery(null, movieData.movie_title));

            return insertedMovieData;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
    * Gets all of the currently known movie records in the database, if there is no movie id given.
    * 
    * @param {*} search - Search string to filter the movies.
    * @param {*} sort - Sort order for the movies (e.g., 'a-z', 'z-a').
    * @returns Object with the all of the movie records data OR error object if it should happen.
    */

    async getAllMovies(id = null, search = null, sort = null){
        
        const sql = this.moviesQuery(null, search, sort)

        try{
            const movies = await this.db.fetchAll(sql);
            return movies;

        }catch(error){
            throw new Error(error.message);
        }

    }

    /**
    * Gets one movie record data from the database, based on the given movie id.
    * 
    * @param {*} id - The id of the movie record to be fetched from the database.
    * @returns Object with the movie record data OR error object if it should happen.
    */
    async getOneMovie(id){

        const sql = this.moviesQuery(id);

        try{
            const movie = await this.db.fetchFirst(sql);
            return movie;

        }catch(error){
            throw new Error(error.message);
        }
    }

    /**
    * Deletes one movie record data from the database, based on the given movie id.
    * 
    * @param {*} id - The id of the movie record to be fetched from the database.
    * @returns Null OR error object if it should happen.
    */
    async deleteMovie(id){

        const sql = `DELETE FROM movie WHERE movie_id = ?`;

        try{
            await this.db.execute(sql, [id]);
            return null;

        }catch (error){
            throw new Error(error.message);
        }

    }

    /**
     * A helper function that builds a query string to insert a movie record into the database.
     * 
     * @returns Query string to insert a movie record in the database.
     */
    insertQuery(){
        return `INSERT INTO movie (category_id, director_id, movie_title, image, description, release_year, score)
                VALUES (?, ?, ?, ?, ?, ?, ?);`;
    }

    // /**
    //  * A helper function that builds a query string to insert a movie record into the database.
    //  * 
    //  * @param {*} movieData - Object with the necessary data for the insert query.
    //  * @param {*} directorId - The ID of the director associated with the movie.
    //  * @returns Query string to insert a movie record in the database.
    //  */
    // insertQuery(movieData, directorId){
    //     return `INSERT INTO movie (category_id, director_id, movie_title, image, description, release_year, score)
    //             VALUES ('${movieData.category}', '${directorId}', '${movieData.movie_title.replaceAll("'", "")}', '${movieData.image}', '${movieData.description.replaceAll("'", "")}', '${movieData.year}', '${movieData.score}')
    //             ON CONFLICT(movie_title) DO UPDATE SET
    //             category_id = excluded.category_id,
    //             director_id = excluded.director_id,
    //             image = excluded.image,
    //             description = excluded.description,
    //             release_year = excluded.release_year,
    //             score = excluded.score;`;
    // }


    /**
     * A helper function that builds a query string to update a movie record in the database.
     * @returns Query string to update a movie record in the database.
     */
    updateQuery(){

        return `UPDATE movie 
                SET category_id=?,
                    director_id=?,
                    movie_title=?,
                    image=?,
                    description=?,
                    release_year=?,
                    score=?
                WHERE movie_id=?`;
    }


    /**
     * A helper function that build a query string to fetch movie records from the database.
     * 
     * @param {*} id - If one movie record is requested, the id of that movie.
     * @param {*} search - If a search string is given, it will filter the movie records based on the movie title.
     * @param {*} sort - The sort order for the movie records ('a-z', 'z-a').
     * @param {*} joinType - The type of join to use when fetching the movie records ('INNER', 'LEFT').
     * @returns 
     */
    moviesQuery(id = null, search = null, sort = 'a-z', joinType = 'INNER'){

        let where = ``;
        let having = ``;
        let order = `ASC`;
        
        if(id) where = `WHERE movie.movie_id = ${id}`;
        if(search) having = `HAVING movie.movie_title LIKE '%${search}%'`;

        if(sort === `z-a`) order = `DESC`;
        
        return `SELECT
                movie.movie_id,
                movie.image,
                movie.movie_title,
                movie.release_year,
                movie.score,
                movie.description,
                category.category_name,
                director.first_name || ' ' || director.last_name AS director_name,
                GROUP_CONCAT(DISTINCT actor.first_name || ' ' || actor.last_name) AS actors
                FROM movie
                ${joinType} JOIN category ON movie.category_id = category.category_id
                ${joinType} JOIN director ON movie.director_id = director.director_id
                ${joinType} JOIN movie_actor ON movie.movie_id = movie_actor.movie_id
                ${joinType} JOIN actor ON movie_actor.actor_id = actor.actor_id 
                ${where}
                GROUP BY movie.movie_id
                ${having}
                ORDER BY movie.movie_title ${order};`;
    }

    /**
     * Checks if the given movie id is in the valid range of existing movie ids in the database.
     * @param {*} id - The movie id to check.
     * @returns True if the id is valid, false otherwise.
     */
    async isIdInRange(id){

        if(id < 1) return false;

        let check;

        try{
            check = await this.db.fetchFirst(`SELECT movie_id FROM movie ORDER BY movie_id DESC`);
            if(id > parseInt(check.movie_id)) return false;

        }catch(error){
            // console.log(error.message);
            return false;
        }

        return true;
    }
}

export default MovieModel;