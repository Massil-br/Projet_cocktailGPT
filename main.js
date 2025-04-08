import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Import de fileURLToPath
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import apiRoutes from './src/routes/api.js';
import authRoutes from './src/routes/authRoutes.js';
import mainRoutes from './src/routes/mainRoutes.js';

const PORT = 3000; // port de sortie
const app = express(); // app qui gérera le serveur

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', apiRoutes); // application de la route /api pour accéder aux requêtes d'api
app.use('/auth', authRoutes);
app.use('/', mainRoutes);  // Route principale avec les pages

app.set('view engine', 'ejs'); // engine ejs pour avoir des pages html dynamiques

// Obtention du chemin absolu du répertoire de vues
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Correctement définir __dirname dans un module ES
app.set('views', path.join(__dirname, 'html')); // Chemin correct vers le dossier "html"
app.use(express.static('static')); // route vers le dossier static pour récupérer par exemple le css

// ouverture du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
});
