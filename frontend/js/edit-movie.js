
//Dit is een vrijwel dezelfde file als 'add-movie.js'. 
//Het enige verschil is dat alle velden in de form worden voorzien van de waarden gebaseerd op de movie_id.
//Om code duplicaat te voorkomen zou ik met een path parameter dit ook kunnen doen bij 'add-movie.js',
//maar ik heb ervoor gekozen om dit in een aparte bestand op te nemen. 
//Netheid in de file naming en foutbestendigheid waren de voornamelijkste redenen om dit te doen. 

const params = new URLSearchParams(window.location.search);
const movieId = params.get(`id`);

const removedActors = [];

const actorList = document.getElementById('actor_list');
let actorCount = 0;
 
async function addDeleteListener(){
     document.getElementById(`delete-movie`).addEventListener('click', async function(e){

          e.preventDefault();

          try{
               const response = await fetch(`http://localhost:3000/movies/${movieId}`, {
                    method: 'DELETE'
               });

               const status = await response.status;
               
               if(status !== 200) new ErrorHandler(false, await response.json(), document);
               else new ErrorHandler(true, `Movie deleted successfully.`, document);

          }catch(error){
               new ErrorHandler(false, error.message, document);
          }

     });
}

async function getActorsFromList(list) {

     let actors = '';

     const actorsFromList = list.children;

     for(let i = 0; i < actorsFromList.length; i++){

          const child = actorsFromList[i];

          const childClone = child.cloneNode(true);
          childClone.querySelector('.remove-actor').remove();
          
          const text = childClone.textContent.trim();

          if(i !== actorsFromList.length - 1){
               actors += text + ',';
          }else{
               actors += text;
          }
          
     }

     return actors;
     
}

function validateActors(){
     
     const actors = actorList.children;

     if(actors.length > 0) return true;

     return false;
}

async function removeActor(e){

     e.preventDefault();

     const actorLi = e.target.closest('li');
     removedActors.push(actorLi.querySelector('.actor-full-name')?.innerText.trim());

     if(actorLi) actorLi.remove();
}

async function removeRemovedActors(){

     const actorsToBeRemoved = removedActors;

     for(let i = 0; i < actorsToBeRemoved.length; i++){
          const fullName = actorsToBeRemoved[i].split(' ');

          let firstName = '';
          let lastName = '';

          for(let j = 0; j < fullName.length; j++){
               if(j == 0){
                    firstName += fullName[j];

               }else{
                    lastName += fullName[j];
               }

          }
          try{
               const response = await fetch(`http://localhost:3000/actor?first=${firstName}&last=${lastName}`);

               if(response.status !== 200){
                    const data = await response.json();
                    new ErrorHandler(false, data.message, document);
                    return;
               }else{
                    const actor = await response.json();
                    const responseMovieActor = await fetch(`http://localhost:3000/movie-actor/${movieId}/${actor.actor_id}`, {
                         method: 'DELETE'
                    });

                    const data = await responseMovieActor.json();

                    if(responseMovieActor.status !== 200){
                         new ErrorHandler(false, data.message, document);
                         return;
                    }
               }

          }catch(error){
               throw new Error(`Error while deleting the existing actors: ${error}`);
          }

     }
}

async function addActor(firstName, lastName){
     actorCount++;

     const closeButton = document.createElement('button');
     closeButton.innerHTML = '&#x2715;';
     closeButton.setAttribute('class', 'remove-actor');
     closeButton.setAttribute('id', 'actor-' + actorCount);
     closeButton.setAttribute('type', 'button');
     closeButton.addEventListener('click', removeActor);
                    

     const name = document.createElement('a');
     name.setAttribute('class', 'actor-full-name');
     name.setAttribute('style', 'text-decoration:none');
     name.innerText = firstName.trim() + ' ' + lastName.trim() + ' ';

     const actor = document.createElement('li');
     actor.setAttribute('class', 'added-actor');
     actor.appendChild(name);
     actor.appendChild(closeButton);

     actorList.appendChild(actor);
     actorList.setAttribute('style', 'display: block');
}

async function addActorListener(){

     document.getElementById('add-actor').onclick = async function() {

          const firstName = document.getElementById('actor_first_name');
          const lastName = document.getElementById('actor_last_name');

          if(firstName.value !== null && firstName.value !== ''
                && lastName.value !== null && firstName.value !== ''){

                    addActor(firstName.value, lastName.value);

                    firstName.value = '';
                    lastName.value = '';

               }else{
                    new ErrorHandler(false, 'An actor needs to have a full name!', document);
               }

     }
}

async function getRemoteImage(imageUrl){

     try{
          const response = await fetch(`http://localhost:3000/get-image?url=${imageUrl}`);
          const data = await response.json();

          if(!response.ok) new ErrorHandler(false, `Error while fetching the existing image: ${data}`, document);

          const blob = await response.blob();

          const file = new File([blob], `image.jpg`, {type: blob.type});
          return file;

     }catch(error){
          throw new Error (`Error while fetching the existing image: ${error}`);
     }
}

async function addMovie() {

    document.getElementById(`add-movie`).addEventListener(`submit`, async function(e){
        
        e.preventDefault();

        const validation = validateActors();

        if(validation){

          try{
               await removeRemovedActors();

          }catch(error){
               new ErrorHandler(false, error.message, document);
               return;
          }

          const form = e.target;
          const formData = new FormData();

          const yearInput = form.querySelector('#year').value;
          const year = yearInput.split('-')[0];
          
          const actors = await getActorsFromList(actorList);

          formData.append('movie_title', form.querySelector('#movie_title').value);
          formData.append('image', form.querySelector('#image').files[0]); 
          formData.append('category', form.querySelector('#category').value);
          formData.append('director_first_name', form.querySelector('#director_first_name').value);
          formData.append('director_last_name',  form.querySelector('#director_last_name').value);
          formData.append('description', form.querySelector('#description').value);
          formData.append('score', form.querySelector('#score').value);
          formData.append('year', year);
          formData.append('actors', actors);

          const response = await fetch('http://localhost:3000/movie', {
               method: 'POST',
               body: formData
          });

          if (response.status === 201) {
               new ErrorHandler(true, 'Movie edited successfully!', document);
          } else {
               new ErrorHandler(false, 'Something went wrong when editing this movie: ' + response.body, document);
          }

        }else{
          new ErrorHandler(false, 'A movie needs to have atleast one actor!', document);
        }
    });

}

async function setFieldValues() {

     if (movieId) {

          try {
               const response = await fetch(`http://localhost:3000/movies/${movieId}`);
               const data = await response.json();

               if (response.status == 200) {
                    const title = document.getElementById(`movie_title`);
                    title.value = data.movie_title;

                    const image = document.getElementById(`image-label`);
                    image.innerHTML += `<br> <a href='${data.image}'>Current image</a>`;

                    const file = document.getElementById(`image`);

                    try {
                         const currentFile = await getRemoteImage(`${data.image}`);

                         const dataTransfer = new DataTransfer();
                         dataTransfer.items.add(currentFile);
                         file.files = dataTransfer.files;

                    } catch (error) {
                         new ErrorHandler(false, `Couldn't get the existing image for this movie: ${error}`, document);
                    }


                    const category = document.getElementById(`${data.category_name}`);
                    category.selected = true;

                    const fullName = data.director_name.split(' ');
                    const directorFirstName = document.getElementById(`director_first_name`);
                    const directorLastName = document.getElementById(`director_last_name`);

                    for (let i = 0; i < fullName.length; i++) {
                         if (i == 0) {
                              directorFirstName.value = fullName[i];

                         } else {
                              directorLastName.value = fullName[i];
                         }
                    }

                    const description = document.getElementById(`description`);
                    description.value = data.description;

                    const score = document.getElementById(`${data.score}`);
                    score.selected = true;

                    const actors = data.actors.split(`,`);

                    for (let i = 0; i < actors.length; i++) {

                         const fullName = actors[i].split(` `);

                         let firstName = ` `;
                         let lastName = ` `;

                         for (let j = 0; j < fullName.length; j++) {
                              if (j == 0) {
                                   firstName += fullName[j];
                              } else {
                                   lastName += fullName[j];
                              }
                         }

                         addActor(firstName, lastName);
                    }

                    const year = document.getElementById(`year`);
                    year.value = `${data.release_year}-01-01`;

               }else{
                    new ErrorHandler(false, `Couldnt set the data for this movie: ${data}`, document);
               }

          } catch (error) {
               new ErrorHandler(false, `Couldn't fetch the data for the movie with the ID: ${movieId}`, document);
          }
     }
}

addDeleteListener();
addActorListener();
addMovie();
setFieldValues();
