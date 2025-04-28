import Watchlist from "../controllers/watchlist.js";

class WatchlistRouter {

    constructor(app, databaseUtils){
        this.app = app;
        this.databaseUtils = databaseUtils;    
        this.watchlist = new Watchlist(this.databaseUtils);
    }

    loadWatchlistRoutes(){
        this.app.get('/watchlist', this.watchlist.getAllFromWatchlist);
        this.app.get('/watchlist/:movieid', this.watchlist.getFromWatchlist)
        this.app.put('/watchlist/:movieid', this.watchlist.addToWatchlist);
        this.app.put('/watchlist/mark-as-watched/:movieid', this.watchlist.markAsWatched);  
        this.app.delete('/watchlist/:movieid', this.watchlist.removeFromWatchlist);
    }

}

export default WatchlistRouter;