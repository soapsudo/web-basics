import DatabaseObject from "./database-object.js";

class Movie extends DatabaseObject{
    
    constructor(databaseUtils){
        super(databaseUtils);
    }

    getAll = async (req, res) => {

        const search = req.query.search;
        const sql = this.movieQuery(null,search);
        
        try {
            const movies = await this.db.fetchAll(sql);
            return res.status(200).json(movies);

        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    getOne = async (req, res) => {

        const parsedId = parseInt(req.params.id);
        if(isNaN(parsedId)) return res.status(400).json('Invalid ID provided');
        
        const inRange = await this.isIdInRange(parsedId);
        if(inRange === false) return res.status(400).json('Invalid ID provided');

        const sql = this.movieQuery(parsedId);

        try{
            const movie = await this.db.fetchFirst(sql);
            return res.status(200).json(movie);

        }catch (error){
            return res.status(500).json(error.message);
        }

    }

    deleteMovie = async (req, res) => {

        const parsedId = parseInt(req.params.id);
        if(isNaN(parsedId)) return res.status(400).json('Invalid ID provided');
        
        const inRange = await this.isIdInRange(parsedId);
        if(inRange === false) return res.status(400).json('Invalid ID provided');
        
        const sql = `DELETE FROM movie WHERE movie_id = ` + parsedId;

        try{
            await this.db.execute(sql);
            return res.status(200).json('The movie with the given ID is deleted.');

        }catch(error){
            return res.status(500).json(error.message);
        }

    }

    movieQuery(id = null, search = null){

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
                ORDER BY movie.movie_title DESC;`;
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

export default Movie;