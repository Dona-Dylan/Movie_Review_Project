// const express = require('express');
// const connectDB = require('./config/db');
// const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Connect Database
// connectDB();

// // Init Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));

// // CORS configuration
// app.use(cors());

// // Define Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/reviews', require('./routes/reviews'));

// app.get("/", async(req,res) => {

//     return res.status(200).send({message: "App is running"})})

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// module.exports= app;












const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: [process.env.REACT_APP_CLIENT_URL,
    '*'
  ], // Add your React app's URL
  methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  credentials: true // If you need to send cookies with the request
};
app.use(cors(corsOptions));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reviews', require('./routes/reviews'));

app.get("/", async (req, res) => {
  return res.status(200).send({ message: "App is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
