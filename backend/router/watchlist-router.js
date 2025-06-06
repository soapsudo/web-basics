import Watchlist from "../controllers/watchlist-controller.js";

class WatchlistRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.watchlist = new Watchlist(this.databaseUtils);
    }
    /**
     * Loads all the routes for the watchlist entity.
     * @return Void
     */
    loadWatchlistRoutes(){
        this.app.get('/watchlist', this.watchlist.getAllFromWatchlist);
        this.app.get('/watchlist/:movieid', this.watchlist.getFromWatchlist)
        this.app.post('/watchlist/:movieid', this.watchlist.addToWatchlist);
        this.app.put('/watchlist/mark-as-watched/:movieid', this.watchlist.markAsWatched);  
        this.app.delete('/watchlist/:movieid', this.watchlist.removeFromWatchlist);
    }

}

export default WatchlistRouter;