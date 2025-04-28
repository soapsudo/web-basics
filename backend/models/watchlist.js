import Model from './model.js';

class WatchlistModel extends Model{
    constructor(db){
        super(db);
    }


    async markMovieAsWatched(movieId){
        const sql = `INSERT INTO watchlist (movie_id, watched) VALUES ('${movieId}', '1')
                     ON CONFLICT(movie_id) DO UPDATE SET
                     movie_id = excluded.movie_id,
                     watched = excluded.watched`;

        try{
            await this.db.execute(sql);
            
        }catch(error){
            throw new Error(error.message);
        }            
    }

    async putMovieInWatchlist(movieId){

        const sql = `INSERT INTO watchlist (movie_id, watched) VALUES ('${movieId}', '0')
                     ON CONFLICT(movie_id) DO UPDATE SET
                     movie_id = excluded.movie_id,
                     watched = excluded.watched`;

        try{
            await this.db.execute(sql);

        }catch(error){
            throw new Error(error.message);
        }
    }

    async getAllMoviesFromWatchlist(filter){

        const sql = this.watchlistMoviesQuery(null, filter);

        try{
            const data = this.db.fetchAll(sql);
            return data;
            
        }catch(error){
            throw new Error(error.message);
        }

    }

    watchlistMoviesQuery(id = null, filter = null){

        let having = ``;
        let where = ``;

        if(id) where = `WHERE movie.movie_id = ${id}`;
        if(filter) having = `HAVING watchlist.watched = `;

        if(filter === 'watched') having += `1`;
        if(filter === 'not-watched') having += `0`;

        return `
                SELECT
                movie.movie_id,
                movie.image,
                movie.movie_title,
                movie.release_year,
                movie.score,
                movie.description,
                watchlist.watched,
                category.category_name,
                director.first_name || ' ' || director.last_name AS director_name,
                GROUP_CONCAT(DISTINCT actor.first_name || ' ' || actor.last_name) AS actors
                FROM movie
                INNER JOIN watchlist ON movie.movie_id = watchlist.movie_id
                INNER JOIN category ON movie.category_id = category.category_id
                INNER JOIN director ON movie.director_id = director.director_id
                INNER JOIN movie_actor ON movie.movie_id = movie_actor.movie_id
                INNER JOIN actor ON movie_actor.actor_id = actor.actor_id 
                ${where}
                GROUP BY movie.movie_id
                ${having}
                ORDER BY movie.movie_title ASC;
        `;

    }

    async getMovieFromWatchlist(movieId){

        const sql = this.watchlistMoviesQuery(movieId);

        try{
            const movie = await this.db.fetchFirst(sql);
            return movie || null;

        }catch(error){
            throw new Error(error.message);
        }
    }

    async removeMovieFromWatchlist(movieId){

        const sql = `DELETE FROM watchlist WHERE movie_id = ${movieId}`;

        try{
            await this.db.execute(sql);

        }catch(error){
            throw new Error(error.message);
        }
    }
}

export default WatchlistModel;