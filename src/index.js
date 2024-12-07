const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const { ErrorController } = require('./controllers/errorController.js');
const viewRoutes = require('./routes/views/index.js');
const manageRoutes = require('./routes/api/manageRoutes.js');
const authorRoutes = require('./routes/api/authorRoutes.js');
const reviewerRoutes = require('./routes/api/reviewerRoutes.js');

const port = 4000;
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Use bodyParser for JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for form-data handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.none());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use('/', viewRoutes);
app.use('/manage', manageRoutes);
app.use('/author', authorRoutes);
app.use('/reviewer', reviewerRoutes);
app.use(ErrorController.get404);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
