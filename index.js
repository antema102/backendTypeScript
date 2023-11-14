import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from 'cors';
import config from './src/config/config';
import mongoose from "mongoose";
import routes from "./src/routes/index.js";
import MongoDBStore from 'connect-mongodb-session';

const app = express(); // Ajoutez les parenthèses ici pour appeler la fonction express
const PORT = config.port ;

const MongoDBStoreSession = MongoDBStore(session); //mongodb de la personne 
const store = new MongoDBStoreSession({
  uri: 'mongodb://127.0.0.1:27017/texto',
  collection: 'sessions'
});

// Configuration d'express-session /* configuration de la session 
{/*
app.use(session({
    secret: 'votre_clé_secrète',
    resave: true,
    store:store,
    saveUninitialized: true,
}));  */}
/* coorse pour session 
const corsOptions = {
    origin: 'http://127.0.0.1:3000',
    credentials: true,
  }; */
// Connection à MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connexion à MongoDB réussie');
    })
    .catch((error) => {
        console.log(`Erreur lors de la connexion à MongoDB ${error}`);
    });

// Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static('public'));

// Utilisation des routes {
    {/*
app.use('/api', routes.userRoute);
app.use('/api', routes.messageRoute);
*/}
app.get('/', (req, res) =>
    res.send(`Serveur node et express port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`Votre serveur est sur le port ${PORT}`)
);
