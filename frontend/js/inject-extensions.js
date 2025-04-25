async function loadElements(){
    document.getElementById("header").innerHTML = `
    <header class="header">
        <div class="logo"><img class="logo-img" src="../images/logo.png" alt="Logo"></div>
        <nav class="menu">
            <a class="header-element" href="../html/movies.html">Movies</a>
            <a class="header-element" href="#watchlist">Watchlist</a>
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

loadElements();

