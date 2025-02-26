const express = require('express'); 
const path = require('path');
const app = express(); // app qui gérera le serveur
const PORT = 3000; // port de sortie
const apiRoutes = require('./src/routes/api'); // route vers les router d'api

app.use(express.json());
app.use('/api', apiRoutes); // application de la route /api pour accéder aux requettes d'api

app.set('view engine', 'ejs'); // engine ejs pour avoir des pages html dynamiques
app.set('views', path.join(__dirname, '/html')); // route vers les pages html
app.use(express.static('static')); // route vers le dossier static pour récupérer par exemple le css

let data ={
    User : "massil",
    IsAdmin : "no"
}



// fonction permettant de créer une page et de l'afficher en insérant aussi des données "data" 
function renderTemplate(res,tmpl,data){
    res.render(tmpl, data, (err,html) =>{
        if (err){
            console.error('Erreur lors  du rendu de la template', err);
            res.status(500).send('Erreur interne du serveur');
            return;
        }
        res.send(html);
    });
}

//route vers la page index.ejs la page de base du site 
app.get('/', (req, res) => {
    renderTemplate(res, 'index', data)
});

// ouverture du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
});
