import Model from './model.js'

class MovieModel extends Model{

    constructor(db){
        super(db);
    }


    async addMovie(movieData){

    


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
                INNER JOIN category ON movie.category_id = category.category_id
                INNER JOIN director ON movie.director_id = director.director_id
                INNER JOIN movie_actor ON movie.movie_id = movie_actor.movie_id
                INNER JOIN actor ON movie_actor.actor_id = actor.actor_id 
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