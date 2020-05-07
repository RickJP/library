if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: false}));

app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);

const env = process.env;
const user = env.REACT_APP_DB_USER
const pw = env.REACT_APP_DB_PW
const server = env.REACT_APP_DB_SERVER
const db_name = env.REACT_APP_DB_NAME
const auth = env.REACT_APP_DB_AUTH

const DB_URL = `mongodb://${user}:${pw}@${server}/${db_name}?authSource=${auth}`

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
const db = mongoose.connection;

db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.listen(process.env.PORT || 4000);

