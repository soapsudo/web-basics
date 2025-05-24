/**
 * Defines a listener for the search form. Redirects the user to the link that corresponds to his search term.
 * @returns {void}
 */
async function searchListener(){
    document.getElementById(`movies-search`).addEventListener(`submit`, function(e){

    e.preventDefault();
    const title = document.getElementById(`movies-search-input`).value;
    if(title) window.location.href = `../html/movies.html?search=${title}`;
});
}
/**
 * Defines a listener for the sort buttons. Redirects the user to the link that corresponds to his chosen sort option.
 * @returns {void}
 */
async function sortListener(){
    document.getElementById(`a-z`).addEventListener(`click`, function(e){
         window.location.href = `../html/movies.html?sort=a-z`;
    });

    document.getElementById(`z-a`).addEventListener(`click`, function(e){
        window.location.href = `../html/movies.html?sort=z-a`;
   });
}
sortListener();
searchListener();
