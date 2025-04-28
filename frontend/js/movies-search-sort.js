async function searchListener(){
    document.getElementById(`movies-search`).addEventListener(`submit`, function(e){

    e.preventDefault();
    const title = document.getElementById(`movies-search-input`).value;
    if(title) window.location.href = `../html/movies.html?search=${title}`;
});
}

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
