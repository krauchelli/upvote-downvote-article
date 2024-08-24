var path = require('path');

module.exports = (app) => {
    app.set('views', path.join(__dirname,'..', 'views'));
    app.engine("ejs", require("ejs").__express);
    app.set('view engine', 'ejs');
};