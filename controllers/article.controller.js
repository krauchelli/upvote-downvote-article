const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../data/articles.json');
const articleModel = require('../models/article.model');


// GET Controllers
exports.getAllArticles = async (req, res) => {
    try {
        const articles = await articleModel.getAllArticles();
        
        res.status(200).json({
            message: 'All articles retrieved successfully!',
            data: articles
        });
    } catch (error) {
        res.json({ message: error.message });
    }
};

exports.getSpecificArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await articleModel.getSpecificArticle(id);
        if (article) {
            res.status(200).json({
                message: 'Article retrieved successfully!',
                data: article
            });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};

// POST Controllers
exports.postArticle = async (req, res) => {
   try {
    const { articleTitle, articleContent } = req.body;
    const sanitizedTitle = sanitizeInput(articleTitle);
    const sanitizedContent = sanitizeInput(articleContent);

    const articles = await articleModel.getAllArticles();

    const articleBody = {
        id: `${articles.length + 1}A${Date.now()}`,
        title: sanitizedTitle,
        content: sanitizedContent,
        upvotes: 0,
        downvotes: 0,
        poster: req.user.username,
        upvotedBy: []
    };

    // tambahkan articleBody ke articles array, kemudian simpan ke file secara permanen
    const article = await articleModel.postArticle(articleBody);
    
    res.status(201).json({
        message: 'Article added successfully!',
        data: article
    });
   } catch (error) {
        res.json({ message: error.message });
   }
};

exports.postUpvote = async (req, res) => {
    try {
        const { id } = req.params;
        const username = req.user.username;

        const article = await articleModel.postUpvote(id, username);
        if (article) {
            res.status(201).json({
                message: "Successfully Voted!",
                data: article
            });
        } else {
            res.status(404).json({ message: `Article with id: ${id} is not found or ${username} already upvoted`});
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};

exports.postDownvote = async (req, res) => {
    try {
        const { id } = req.params;
        const username = req.user.username;
        const article = await articleModel.postDownvote(id, username);

        if (article) {
            res.status(201).json({
                message: "Successfully voted!",
                data: article
            });
        } else {
            res.status(404).json({ message: `Article with id: ${id} is not found or ${username} already downvoted` });
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};

// DELETE Controlllers
exports.deleteArticle = (req, res) => {
    try {
    const { id } = req.params;
    const articles = readData();

    // mencari validasi dengan mencari index
    const index = articles.findIndex(i => i.id === parseInt(id));
    if (index !== -1) {
        articles.splice(index, 1);
        writeData(articles);
        
        res.status(200).json({ message: 'Article Deleted'});
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
    } catch (error) {
        res.json({ message: error.message });
    }
};


// helper controllers
const readData = () => {
    const data = fs.readFileSync(dataPath, 'utf8');

    return JSON.parse(data);
};
const writeData = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}

const sanitizeInput = (input) => {
    return input.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
};