
async function addMovie() {

    document.getElementById(`add-movie`).addEventListener(`submit`, async function(e){
        e.preventDefault();

        const form = e.target;
        const formData = new FormData();

        formData.append('movie_title', form.querySelector('#movie_title').value);
        formData.append('image', form.querySelector('#image').files[0]); 
        formData.append('category', form.querySelector('#category').value);
        formData.append('director', form.querySelector('#director').value);
        formData.append('description', form.querySelector('#description').value);
        formData.append('score', form.querySelector('#score').value);
        formData.append('year', form.querySelector('#year').value);

        const response = await fetch('http://localhost:3000/movie', {
             method: 'POST',
             body: formData
        });

        // if (response.ok) {
        //     alert('Movie uploaded successfully!');
        // } else {
        //     alert('Something went wrong');
        // }
        
    });
}

addMovie();