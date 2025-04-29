import Model from './model.js'
import DirectorModel from './director.js';
import ActorModel from './actor.js';
import { title } from 'process';
import { join } from 'path';

class MovieModel extends Model{

    constructor(db){
        super(db);
        this.director = new DirectorModel(db);
        this.actor = new ActorModel(db);
    }


    async addMovie(movieData) {

        const actorNames = movieData.actors.split(',');

        let sql;

        try{
            const director = await this.director.getDirector(movieData.director_first_name, movieData.director_last_name);

            if (director && 'director_id' in director && director.director_id !== null && director.director_id !== undefined && director.director_id !== '') {
                sql = this.insertQuery(movieData, director.director_id);

            } else {
                const insertedDirector = await this.director.insertDirector(movieData.director_first_name, movieData.director_last_name);
                sql = this.insertQuery(movieData, insertedDirector.director_id);
            }

        }catch(error){
            throw new Error(error.message);
        }
        
        
        try {

            const insert = await this.db.execute(sql);            
            let insertedMovieData = await this.db.fetchFirst(this.moviesQuery(null, movieData.movie_title, 'a-z', `LEFT`));

            const insertedActorsForMovie = await this.actor.insertActorsForMovie(actorNames, insertedMovieData.movie_id);

            insertedMovieData = await this.db.fetchFirst(this.moviesQuery(null, movieData.movie_title));

            return insertedMovieData;

        } catch (error) {
            throw new Error(error.message);
        }

    }


    async getAllMovies(id = null, search = null, sort = null){
        
        const sql = this.moviesQuery(null, search, sort)

        try{
            const movies = await this.db.fetchAll(sql);
            return movies;

        }catch(error){
            throw new Error(error.message);
        }

    }

    async getOneMovie(id){

        const sql = this.moviesQuery(id);

        try{
            const movie = await this.db.fetchFirst(sql);
            return movie;

        }catch(error){
            throw new Error(error.message);
        }
    }

    async deleteMovie(id){

        const sql = `DELETE FROM movie WHERE movie_id = ${id}`;

        try{
            await this.db.execute(sql);
            return null;

        }catch (error){
            throw new Error(error.message);
        }

    }

    insertQuery(movieData, directorId){
        return `INSERT INTO movie (category_id, director_id, movie_title, image, description, release_year, score)
                VALUES ('${movieData.category}', '${directorId}', '${movieData.movie_title}', '${movieData.image}', '${movieData.description}', '${movieData.year}', '${movieData.score}')
                ON CONFLICT(movie_title) DO UPDATE SET
                category_id = excluded.category_id,
                director_id = excluded.director_id,
                image = excluded.image,
                description = excluded.description,
                release_year = excluded.release_year,
                score = excluded.score;`;
    }

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