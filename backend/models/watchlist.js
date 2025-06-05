import Model from './model.js';

class WatchlistModel extends Model{
    constructor(db){
        super(db);
    }

    /**
     * Marks a movie as watched in the watchlist.   
     * @param {*} movieId - The ID of the movie to mark as watched.
     * @returns Void OR error object if it should happen. 
     */
    async markMovieAsWatched(movieId){
        const sql = `INSERT INTO watchlist (movie_id, watched) VALUES (?, '1')
                     ON CONFLICT(movie_id) DO UPDATE SET
                     movie_id = excluded.movie_id,
                     watched = excluded.watched`;

        try{
            await this.db.execute(sql, [movieId]);
            
        }catch(error){
            throw new Error(error.message);
        }            
    }

    /**
     * Takes a movie ID and sets it in the watchlist with watched = 0.
     * If the movie is already in the watchlist, it updates the watched status to 0.  
     * @param {*} movieId - The ID of the movie to put into the watchlist.
     * @returns Void OR error object if it should happen. 
     */
    async putMovieInWatchlist(movieId){

        const sql = `INSERT INTO watchlist (movie_id, watched) VALUES (?, '0')
                     ON CONFLICT(movie_id) DO UPDATE SET
                     movie_id = excluded.movie_id,
                     watched = excluded.watched`;

        try{
            await this.db.execute(sql, [movieId]);

        }catch(error){
            throw new Error(error.message);
        }
    }

    /**
     * Uses the watchlistMoviesQuery to fetch all movies from the watchlist.
     * @param {*} filter - Optional filter to get only watched or not-watched movies.
     * @returns Void OR error object if it should happen.
     */
    async getAllMoviesFromWatchlist(filter){

        const sql = this.watchlistMoviesQuery(null, filter);

        try{
            const data = this.db.fetchAll(sql);
            return data;
            
        }catch(error){
            throw new Error(error.message);
        }

    }

    /**
     * Builds a SQL query to fetch movies from the watchlist, optionally filtered by movie ID and watched status.
     * @param {*} id - Optional movie ID to filter the results.
     * @param {*} filter - Optional filter to get only watched or not-watched movies.
     * @returns SQL query string to fetch movies from the watchlist.
     */
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

    /**
     * Fetches a movie from the watchlist based on the given movie ID.
     * @param {*} movieId - The ID of the movie to fetch from the watchlist.
     * @returns Movie data in a JSON object OR null if the movie is not found.
     */
    async getMovieFromWatchlist(movieId){

        const sql = this.watchlistMoviesQuery(movieId);

        try{
            const movie = await this.db.fetchFirst(sql);
            return movie || null;

        }catch(error){
            throw new Error(error.message);
        }
    }
    /**
     * Removes a movie from the watchlist based on the given movie ID.
     * @param {*} movieId - The ID of the movie to remove from the watchlist.
     * @returns Void OR error object if it should happen.
     */
    async removeMovieFromWatchlist(movieId){

        const sql = `DELETE FROM watchlist WHERE movie_id = ?`;

        try{
            await this.db.execute(sql, [movieId]);

        }catch(error){
            throw new Error(error.message);
        }
    }
}

export default WatchlistModel;