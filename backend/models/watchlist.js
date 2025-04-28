import Model from './model.js';

class WatchlistModel extends Model{
    constructor(db){
        super(db);
    }

    async putMovieInWatchlist(movieId){

        const sql = `INSERT OR REPLACE INTO watchlist (movie_id, watched) VALUES ('${movieId}', '0')`;

        try{
            await this.db.execute(sql);

        }catch(error){
            throw new Error(error.message);
        }
    }

    async getMovieFromWatchlist(movieId){

        const sql = `SELECT * FROM watchlist WHERE movie_id = ${movieId}`;

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