const express = require('express'); 
const path = require('path');
const app = express(); 
const PORT = 3000; 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/html'));

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


app.get('/', (req, res) => {
    const data = {message: 'Bienvenue sur ma page EJS!'};
    renderTemplate(res, 'index', data)
});

app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
});
