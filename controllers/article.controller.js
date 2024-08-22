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
        const article = await articleModel.getSpecificArticle(parseInt(id));
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

    console.log(article);
    
    res.status(201).json({
        message: 'Article added successfully!',
        data: article
    });
   } catch (error) {
        res.json({ message: error.message });
   }
};

exports.postUpvote = (req, res) => {
    try {
        const { id } = req.params;
        const articles = readData();

        //validation
        const article = articles.find(i => i.id === parseInt(id));
        if (article) {
            article.upvotes++;
            writeData(articles);
            res.status(201).json({
                message: "Successfully voted!",
                data: articles
            })
        } else {
            res.status(404).json({message: 'Article not found'})
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};

exports.postDownvote = (req, res) => {
    try {
        const { id } = req.params;
        const articles = readData();
    
        //validation
        const article = articles.find(i => i.id === parseInt(id));
        if (article) {
            article.downvotes++;
            writeData(articles);
            res.status(201).json({
                message: "Successfully voted!",
                data: articles
            })
        } else {
            res.status(404).json({ message: 'Article not found'});
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