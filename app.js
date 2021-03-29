const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//Import routes
const usersRouter = require('./routes/users')
app.use('/users', usersRouter);


//Connect DB
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useNewUrlParser: true,  useUnifiedTopology: true  }, 
    () => console.log('Connected to DB!')
)

//Start listening
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));