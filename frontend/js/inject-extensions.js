/**
 * Loads the header and the footer inner HTML for every page where the script gets used.
 * @returns {void}
 */
async function loadElements(){
    document.getElementById("header").innerHTML = `
    <header class="header">
        <div class="logo"><img class="logo-img" src="../images/logo.png" alt="Logo"></div>
        <nav class="menu">
            <a class="header-element" href="../html/movies.html">Movies</a>
            <a class="header-element" href="../html/watchlist.html">Watchlist</a>
        </nav>
    </header>
`;

document.getElementById("footer").innerHTML = `
    <footer class="footer">
        <div class="footer-content">
            <p>&copy; Movie Mania 2025</p>
        </div>
    </footer>
`;
}

class ErrorHandler {
    /**
     * Used for pop-ups where the user sees the status of the operations executed while the frontend communicates with the backend.
     * @param {*} success - Boolean to mark if the operation weas successful (true if yes, false if no).
     * @param {*} message - Message to be displayed in the pop-up.
     * @param {*} document - HTML page where the pop-up is to be displayed.
     */
    constructor(success, message, document){
        this.document = document;
        this.loadHTML(success, message);
    }

    loadHTML(success, message){
        const popup = this.document.getElementById('popup');

        if(success){
            popup.setAttribute('class', 'popup-green');
            popup.innerHTML = `
            <div class="popup-text">${message}</div>
            <button class="close-btn" onclick="document.getElementById('popup').style.display='none'">&times;</button>`;

        }else{
            popup.setAttribute('class', 'popup-red');
            popup.innerHTML = `
            <div class="popup-text">${message}</div>
            <button class="close-btn" onclick="document.getElementById('popup').style.display='none'">&times;</button>`;
        }
    }
}

window.ErrorHandler = ErrorHandler;

loadElements();

