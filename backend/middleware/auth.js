const jwt = require('jsonwebtoken');
const config = require("../config/auth.config");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token) return res.status(400).send('Accès refusé !');

        const verified = jwt.verify(token, config.secret);

        if (!verified.userId) return res.status(401).send('Token invalid !');
        
        req.userId = verified.userId;
        req.isAdmin = verified.isAdmin;
        next();
    } catch {
        res.status(401).json({ error: 'Accès refusé ! (InvalideToken)' });
    }
};