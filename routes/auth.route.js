var express = require('express');
var router = express.Router();
var authController = require('../controllers/auth.controller');

//GET routes
router.get('/login', (req, res) => {
    res.render('auth/login');
});
router.get('/register', (req, res) => {
    res.render('auth/register');
});
router.get('/logout', (req, res) => {
    res.redirect('/');
});

//POST routes
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;