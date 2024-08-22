var express = require('express');
var router = express.Router();
var articleController = require('../controllers/article.controller');
var { isAuthenticated } = require('../middlewares/auth.middleware');

//GET routes
router.get('/', isAuthenticated, articleController.getAllArticles);
router.get('/:id/details', isAuthenticated, articleController.getSpecificArticle);

//POST routes
router.post('/', articleController.postArticle);
router.post('/:id/upvote', articleController.postUpvote);
router.post('/:id/downvote', articleController.postDownvote);

//DELETE routes
router.delete('/:id/delete', articleController.deleteArticle);

module.exports = router;