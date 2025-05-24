const actorList = document.getElementById('actor_list');
let actorCount = 0;
 

/**
 * Takes the unordered list of all inserted actors when adding a movie and coverts it to one 
 * comma seperated string. 
 * @returns {string} - String with all of the actors, comma seperated.
 */
async function getActorsFromList() {

     let actors = '';

     const actorsFromList = actorList.children;

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

     if(actorLi) actorLi.remove();
}

/**
 * Adds the actor using the first and the last name in the form, IF it is valid.
 * Makes a new HTML element that lets the user see the added data immediately.
 * @return {void} 
 */
async function addActor(){

     document.getElementById('add-actor').onclick = async function() {

          const firstName = document.getElementById('actor_first_name');
          const lastName = document.getElementById('actor_last_name');

          if(firstName.value !== null && firstName.value !== ''
                && lastName.value !== null && firstName.value !== ''){

                    actorCount++;

                    const closeButton = document.createElement('button');
                    closeButton.innerHTML = '&#x2715;';
                    closeButton.setAttribute('class', 'remove-actor');
                    closeButton.setAttribute('id', 'actor-' + actorCount);
                    closeButton.setAttribute('type', 'button');
                    closeButton.addEventListener('click', removeActor);
                    
                    const actor = document.createElement('li');
                    actor.setAttribute('class', 'added-actor');
                    actor.innerText = firstName.value.trim() + ' ' + lastName.value.trim() + ' ';
                    actor.appendChild(closeButton);

                    actorList.appendChild(actor);
                    actorList.setAttribute('style', 'display: block');

                    firstName.value = '';
                    lastName.value = '';

               }else{
                    new ErrorHandler(false, 'An actor needs to have a full name!', document);
               }

     }
}

/**
 * Takes the user input in the form on the HTML page and makes the call to the backend to add the movie record.
 * @returns {void}
 */
async function addMovie() {

    document.getElementById(`add-movie`).addEventListener(`submit`, async function(e){
        
        e.preventDefault();

        const validation = validateActors();

        if(validation){
          const form = e.target;
          const formData = new FormData();

          const yearInput = form.querySelector('#year').value;
          const year = yearInput.split('-')[0];
          
          const actors = await getActorsFromList();

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
               new ErrorHandler(true, 'Movie added successfully!', document);
          } else {
               new ErrorHandler(false, 'Something went wrong when adding this movie.', document);
          }

        }else{
          new ErrorHandler(false, 'A movie needs to have atleast one actor!', document);
        }
    });
}

addActor();
addMovie();