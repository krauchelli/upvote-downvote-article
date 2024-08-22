const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.JWT_SECRET;

exports.isAuthenticated = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader && authorizationHeader.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        console.log(`user id: ${JSON.stringify(req.user.id)}`);
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};

exports.redirectIfAuthenticated = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];
    console.log(`information about logged user: ${req.user}`);
    if (token) {
        try {
            jwt.verify(token, secret);
            return res.redirect('/articles');
        } catch (error) {
            next();
        }
    }
    next();
};