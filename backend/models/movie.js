import Model from './model.js'
import DirectorModel from './director.js';

class MovieModel extends Model{

    constructor(db){
        super(db);
        this.director = new DirectorModel(db);
    }


    async addMovie(movieData) {

        const director = await this.director.getDirector(movieData.director_first_name, movieData.director_last_name);

        let sql;

        if (director && 'director_id' in director && director.director_id !== null && director.director_id !== undefined && director.director_id !== '') {
            sql = this.insertQuery(movieData, director.director_id);

        } else {
            const insertedDirector = await this.director.insertDirector(movieData.director_first_name, movieData.director_last_name);
            sql = this.insertQuery(movieData, insertedDirector.director_id);
        }

        try {
            const insert = await this.db.execute(sql);
            return movieData;

        } catch (error) {
            return error;
        }

    }


    async getAllMovies(id = null, search = null){
        
        const sql = this.moviesQuery(null, search)

        try{
            const movies = await this.db.fetchAll(sql);
            return movies;

        }catch(error){
            return error;
        }

    }

    async getOneMovie(id){

        const sql = this.moviesQuery(id, null);

        try{
            const movie = await this.db.fetchFirst(sql);
            return movie;

        }catch(error){
            return error;
        }
    }

    async deleteMovie(id){

        const sql = `DELETE FROM movie WHERE movie_id = ` + id;

        try{
            const deleted = await this.db.execute(sql);
            return deleted;

        }catch (error){
            return error;
        }

    }

    insertQuery(movieData, directorId){
        return `INSERT OR REPLACE INTO movie (category_id, director_id, movie_title, image, description, release_year, score)
                VALUES ('${movieData.category}', '${directorId}', '${movieData.movie_title}', '${movieData.image}', '${movieData.description}', '${movieData.year}', '${movieData.score}')`;
    }

    moviesQuery(id = null, search = null){

        let where = ``;
        let having = ``;
        
        if(id) where = `WHERE movie.movie_id = ${id}`;
        if(search) having = `HAVING movie.movie_title LIKE '%${search}%'`;
        
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
                LEFT JOIN category ON movie.category_id = category.category_id
                LEFT JOIN director ON movie.director_id = director.director_id
                LEFT JOIN movie_actor ON movie.movie_id = movie_actor.movie_id
                LEFT JOIN actor ON movie_actor.actor_id = actor.actor_id 
                ${where}
                GROUP BY movie.movie_id
                ${having}
                ORDER BY movie.movie_title ASC;`;
    }

    async isIdInRange(id){

        if(id < 1) return false;

        let check;

        try{
            check = await this.db.fetchFirst(`SELECT movie_id FROM movie ORDER BY movie_id DESC`);
            if(id > parseInt(check.movie_id)) return false;

        }catch(error){
            console.log(error.message);
            return false;
        }

        return true;
    }
}

export default MovieModel;