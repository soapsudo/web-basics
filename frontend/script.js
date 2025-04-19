fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(data => {
        const usersDiv = document.getElementById('users');
        usersDiv.innerHTML = '<h2>Users:</h2><ul>' + 
            data.map(user => `<li>${user.name}</li>`).join('') + 
            '</ul>';
    })
    .catch(error => console.error('Error fetching users:', error));