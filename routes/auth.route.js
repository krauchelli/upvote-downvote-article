var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');

const { isAuthenticated, redirectIfAuthenticated } = require('../middlewares/auth.middleware');

//GET routes
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('auth/login');
});
router.get('/register', redirectIfAuthenticated, (req, res) => {
    res.render('auth/register');
});
router.get('/logout', (req, res) => {
    res.redirect('/');
});

//POST routes
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;