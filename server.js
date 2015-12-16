/*
 * SERVER.JS
 */

require('dotenv').load();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express')
  , app = express()
  , path = require('path')
  , bodyParser = require('body-parser')
  , flash = require('connect-flash')
  , cors = require('cors')
  , logger = require('morgan')
  , mongoose  = require('mongoose');

// mongoose.connect(config.db);

app.use("/", express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(logger('dev'));
app.use(flash());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var ejs = require('ejs');
app.engine('html', ejs.renderFile); 
app.set('view engine', 'html');

// // RESOURCES
// app.get('/', resources.index);
// app.get('/templates/:name', resources.templates);
// require('./resources/users')(app);

// // redirect all others to the index (HTML5 history)
// app.get('*', resources.index);

// module.exports = server;
app.listen(3000);
console.log('server running at http://localhost:' + 3000);