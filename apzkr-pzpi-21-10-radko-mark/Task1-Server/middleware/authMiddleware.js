const jwt = require('jsonwebtoken')
const languages = require('../locale/lang')

module.exports = function (req, res, next) {
    let preferredLang;
    try {
        const { Lang } = req.body;
        preferredLang = Lang;

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: languages.getLocalizedString(preferredLang, "Not authorised") });
        }

        const token = authHeader.split(' ')[1]; // Bearer token
        if (!token) {
            return res.status(401).json({ error: languages.getLocalizedString(preferredLang, "Not authorised") });
        }

        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (e) {
        console.error("Unexpected error:", e);
        return res.status(401).json({ error: languages.getLocalizedString(preferredLang, "Unexpected error") });
    }
};