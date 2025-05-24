
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
 
/**
 * Adds the listener on the button that deletes the movie record.
 * Uses the movieid from the HTML page as the path parameter needed for the movie deletion.
 * @returns {void}
 */
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

/**
 * Takes the unordered list of all inserted actors when adding a movie and coverts it to one 
 * comma seperated string. 
 * @returns {string} - String with all of the actors, comma seperated.
 */
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

/**
 * Checks if there are actors added in the form's actor list.
 * @returns {boolean} True if there are actors added into the list, false if there are none.
 */
function validateActors(){
     
     const actors = actorList.children;

     if(actors.length > 0) return true;

     return false;
}


/**
 * Removes an actor from the HTML list and from the array that 
 * is later used for the movie record actor insertion.
 * @returns {void} 
 */
async function removeActor(e){

     e.preventDefault();

     const actorLi = e.target.closest('li');
     removedActors.push(actorLi.querySelector('.actor-full-name')?.innerText.trim());

     if(actorLi) actorLi.remove();
}

/**
 * Removes the many-to-many relation in the backend using the array of actors that have been removed from the form
 * @returns {void}
 */
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

/**
 * Adds an actor to the backend, using the endpoint that checks if the actor already exists.
 * This is necessary because the many-to-many relation needs the actorid and a movieid to make the coupling.
 * @param {*} firstName - First name of the actor to be added.
 * @param {*} lastName - Last name of the actor to be added.
 * @returns {void} 
 */
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

/**
 * Adds a click listener to the button used for adding actors from the form fields.
 * @returns {void}
 */
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

/**
 * Makes a API call to the backend that gets the image from a remote link and returns it as a file object.
 * This is necessary because the images get saved as links in the database, and the form asks for a file upload.
 * @param {*} imageUrl - The link where the remote image is saved.
 * @returns {File} - The image in a file format.
 */
async function getRemoteImage(imageUrl){

     try{
          const response = await fetch(`http://localhost:3000/get-image?url=${imageUrl}`);

          if(!response.ok) throw new Error(`Server error while fetching the existing image.`);

          const blob = await response.blob();

          const file = new File([blob], `image.jpg`, {type: blob.type});
          return file;

     }catch(error){
          throw new Error (`Error while fetching the existing image: ${error}`);
     }
}

/**
 * Adds a click event listener on the button that is used to submit the form for adding the movie (editing in this case).
 * @returns {void}
 */
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

/**
 * Longest function in the whole project. Used to make a call to the backend that returns all of the data for the movie that is being edited.
 * All of the data recieved from the backend needs to be set in the edit form, so that the user sees which data he can edit.
 * This is also the function where the remote image is set as a file object.
 * @returns {void}
 */
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
