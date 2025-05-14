import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Import de fileURLToPath
import bodyParser from 'body-parser';
import session from 'express-session';
import apiRoutes from './src/routes/api.js';
import authRoutes from './src/routes/authRoutes.js';
import mainRoutes from './src/routes/mainRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { verifySession } from './src/controllers/authController.js';
import { getFortniteSkins } from './src/routes/skins.js';

const PORT = 3000; // port de sortie
const app = express(); // app qui gérera le serveur

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de express-session
app.use(session({
    secret: 'votre_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,  // Garder false pour développement sans HTTPS
        httpOnly: true, // Empêche l'accès aux cookies via JS (bon pour la sécurité)
        maxAge: 3600000, // 1 heure
        sameSite: 'Lax', // Important pour la compatibilité avec les navigateurs modernes
    }
}));

// Middleware pour gérer tempMessage
app.use((req, res, next) => {
    if (req.session.tempMessage) {
        res.locals.tempMessage = req.session.tempMessage;  // Ajoute tempMessage à res.locals pour le rendre disponible dans les vues
        delete req.session.tempMessage;  // Supprime après affichage
    } else {
        res.locals.tempMessage = null;  // Aucun message si tempMessage est absent
    }
    next();
});

// Middleware pour rendre session disponible dans tous les templates
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use(verifySession);
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.get('/api/skins', getFortniteSkins); // Route pour récupérer les skins Fortnite

app.use('/api', apiRoutes); // application de la route /api pour accéder aux requêtes d'api
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', mainRoutes);  // Route principale avec les pages
app.use('/uploads', express.static('uploads'));

app.set('view engine', 'ejs'); // engine ejs pour avoir des pages html dynamiques

// Obtention du chemin absolu du répertoire de vues
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Correctement définir __dirname dans un module ES
app.set('views', path.join(__dirname, 'html')); // Chemin correct vers le dossier "html"
app.use(express.static('static')); // route vers le dossier static pour récupérer par exemple le css

// ouverture du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
}); 
