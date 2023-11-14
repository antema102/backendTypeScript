
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'pas de token' });
  }

  try {
    const decoded = jwt.verify(token, 'votre_clé_secrète');
    req.user = decoded; // Ajoutez les informations utilisateur décodées à la requête pour une utilisation ultérieure
    next(); // Poursuivre le traitement de la requête
  } catch (error) {
    return res.status(401).json({ message: 'Accès non autorisé.' });
  }
};

module.exports = authMiddleware;
