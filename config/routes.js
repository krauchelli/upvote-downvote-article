var indexRouter = require('../routes/index');
var authRouter = require('../routes/auth.route');
var articleRouter = require('../routes/article.route');

module.exports = (app) => {
    app.use('/', indexRouter);
    // !-- Do not remove this line --! //

    app.use('/auth', authRouter);
    app.use('/articles', articleRouter);
};