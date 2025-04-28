export default class ErrorHandler{

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
