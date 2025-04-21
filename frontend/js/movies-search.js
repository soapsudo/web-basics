async function listener(){
    document.getElementById(`movies-search`).addEventListener(`submit`, function(e){
    e.preventDefault();
    const title = document.getElementById(`movies-search-input`).value;
    window.location.href = `../html/movies.html?search=${title}`;
});
}

listener();
