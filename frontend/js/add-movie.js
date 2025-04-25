
async function addMovie() {

    document.getElementById(`add-movie`).addEventListener(`submit`, function(e){
        e.preventDefault();
        console.log(document.getElementById(`image`));

        const file = document.getElementById(`image`);

        if(file.files.length){
            let reader = new FileReader();

            reader.onload
        }
        
    });
}

addMovie();