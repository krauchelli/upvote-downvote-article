var indexRouter = require('../routes/index');
var articleRouter = require('../routes/article.route');

module.exports = (app) => {
    app.use('/', indexRouter);
    // !-- Do not remove this line --! //

    app.use('/articles', articleRouter);
};