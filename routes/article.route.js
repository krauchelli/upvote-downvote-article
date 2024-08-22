var express = require('express');
var router = express.Router();
var articleController = require('../controllers/article.controller');
var { isAuthenticated } = require('../middlewares/auth.middleware');

//GET routes
router.get('/', isAuthenticated, articleController.getAllArticles);
router.get('/:id/details', isAuthenticated, articleController.getSpecificArticle);

//POST routes
router.post('/', isAuthenticated, articleController.postArticle);
router.post('/:id/upvote', isAuthenticated, articleController.postUpvote);
router.post('/:id/downvote', isAuthenticated, articleController.postDownvote);

//DELETE routes
router.delete('/:id/delete', isAuthenticated, articleController.deleteArticle);

module.exports = router;