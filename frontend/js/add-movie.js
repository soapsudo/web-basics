const actorList = document.getElementById(`actor_list`);

async function addActor(){

     document.getElementById(`add-actor`).onclick = function() {

          const firstName = document.getElementById(`actor_first_name`);
          const lastName = document.getElementById(`actor_last_name`);

          if(firstName.value !== null && firstName.value !== ``
                && lastName.value !== null && firstName.value !==``){

                    const actor = document.createElement(`li`);

                    actor.innerText(firstName.value + ` ` + lastName.value);
                    actorList.appendChild(actor);

               }

     }
}


async function addMovie() {

    document.getElementById(`add-movie`).addEventListener(`submit`, async function(e){
        e.preventDefault();

        const form = e.target;
        const formData = new FormData();

        const yearInput = form.querySelector('#year').value;
        const year = yearInput.split('-')[0];

        formData.append('movie_title', form.querySelector('#movie_title').value);
        formData.append('image', form.querySelector('#image').files[0]); 
        formData.append('category', form.querySelector('#category').value);
        formData.append('director_first_name', form.querySelector('#director_first_name').value);
        formData.append('director_last_name',  form.querySelector('#director_last_name').value);
        formData.append('description', form.querySelector('#description').value);
        formData.append('score', form.querySelector('#score').value);
        formData.append('year', year);

        console.log(formData);

        const response = await fetch('http://localhost:3000/movie', {
             method: 'POST',
             body: formData
        });

        if (response.ok) {
             alert('Movie uploaded successfully!');
        } else {
             alert('Something went wrong');
        }
        
    });
}

addMovie();