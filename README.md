# Web Basics
Deze map is de finale versie van de toetsopdracht voor de module 1.4 Web Basics, binnen de opleiding HBO-ICT op Saxion.
In de map kunnen de uitwerkingen van alle opdrachtvereisten worden gevonden. 

## Inhoud
### Backend
Een simpele backend RESTful API service die gemaakt is met Node.js en Express.js. Alle data waarover de backend beschikt wordt opgeslagen in de ingebouwde sqlite driver.
De technische opbouw en beschrijving van de API service is te vinden in het document: `documentatie/Movie_Mania_API_specs.pdf`

### Frontend
Frontend is opgebouwd uit statische HTML + CSS + JS, en kent geen frameworks. Voor de technische opbouw en beschrijving van de gebouwde 
functionaliteiten, zie het document: `documentatie/Movie_Mania_Functioneel_Ontwerp.pdf`

### Documentatie
Documentatie voor deze applicatie bestaat uit:
- Het functioneel ontwerp, waarin de context van de applicatie samen met UX/UI beschreven wordt: `documentatie/Movie_Mania_Functioneel_Ontwerp.pdf`
- Technische documentatie samen met alle mogelijke API responses: `documentatie/Movie_Mania_API_specs.pdf` 

## Het opstarten van de applicatie
Deze applicatie kan op twee manieren worden opgestart:
- Lokaal (op de machine zelf)
- Met behulp van `docker`

Hier is bewust voor gekozen, omdat inleveren van een applicatie gebaseerd op Node.js samen met `node_modules` kan zorgen voor compatibiliteitsproblemen.
Door de hieronder genoemde instructies te volgen is het eenvoudig om op beide manieren de applicatie op te starten. 

### Lokaal opstarten:
Vereist: `node.js` installatie op de machine
<br><br>
Navigeer naar de `/backend` directory binnen deze map in een terminal en voer de volgende commando's in:
- `npm install` - wat zorgt dat de _platform-specifieke_ dependencies worden geinstalleerd
- `npm start` - het opstarten van de backend API service op `http://localhost:3000`

Vervolgens kan de website bekeken worden als het document `frontend/index.html` wordt geopend in de browser.

### Opstarten met Docker:
Vereist: `docker` installatie op de machine, samen met `docker compose`
<br><br>
Navigeer naar de root directory van deze map in een terminal en voer de volgende commando in:
- `docker compose up` - wat zorgt dat backend en frontend samen in twee aparte docker 
containers worden opgestart, verbonden met een bridged netwerk

Vervolgens kan de applicatie worden bekeken op het web-adres: `http://localhost:8080`.




