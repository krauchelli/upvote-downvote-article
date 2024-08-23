const path = require('path');
const { readData } = require('../utils/readData');
const { writeData } = require('../utils/writeData');
const articleDataPath = path.join(__dirname, '../data/articles.json');

exports.getAllArticles = async () => {
    return await readData(articleDataPath);
};

exports.getSpecificArticle = async (id) => {
    const articles = await readData(articleDataPath);
    return articles.find(article => article.id === id);
};

exports.postArticle = async (article) => {
    const articles = await readData(articleDataPath);
    articles.push(article);
    await writeData(articleDataPath, articles);
    return article;
};

exports.deleteArticle = async (id) => {
    const articles = await readData(articleDataPath);
    const filteredArticles = articles.filter(article => article.id !== id);
    await writeData(articleDataPath, filteredArticles);
    return filteredArticles;
};

exports.postUpvote = async (id, username) => {
    const articles = await readData(articleDataPath);
    const article = articles.find(a => a.id === id);

    if (article) {
        if (article.upvotedBy.includes(username)) {
            return null
        }

        if (article.downvotedBy && article.downvotedBy.includes(username)) {
            article.downvotes--;
            article.downvotedBy = article.downvotedBy.filter(user => user !== username);
        }

        article.upvotes++;
        article.upvotedBy.push(username);
        await writeData(articleDataPath, articles);
        return article;
    }
    return null;
};

exports.postDownvote = async (id, username) => {
    const articles = await readData(articleDataPath);
    const article = articles.find(a => a.id === id);
    
    if (article) {
        if (article.downvotedBy && article.downvotedBy.includes(username)) {
            return null;
        }

        if (article.upvotedBy.includes(username)) {
            article.upvotes--;
            article.upvotedBy = article.upvotedBy.filter(user => user !== username);
        }

        article.downvotes++;
        article.downvotedBy = article.downvotedBy || [];
        article.downvotedBy.push(username);
        await writeData(articleDataPath, articles);
        return article;
    }
    return null;
};