/**
 * Defines a listener for the sort buttons. Redirects the user to the link that corresponds to his chosen sort option.
 * @returns {void}
 */
async function sortListener(){
    document.getElementById(`watched`).addEventListener(`click`, function(e){
         window.location.href = `../html/watchlist.html?filter=watched`;
    });

    document.getElementById(`not-watched`).addEventListener(`click`, function(e){
        window.location.href = `../html/watchlist.html?filter=not-watched`;
   });
}
sortListener();