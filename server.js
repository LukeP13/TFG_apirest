require('dotenv/config')

const express       = require('express')
const mongoose      = require('mongoose')
const morgan        = require('morgan')
const cors          = require('cors')

const AuthRoute     = require('./src/routes/auth')
const UsersRoute    = require('./src/routes/users')
const BrandsRoute   = require('./src/routes/brands')

const authenticate  = require('./src/middlewares/authenticate')


//Connect DB
mongoose.connect(
    process.env.LOCAL_DB_CONNECTION, 
    { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true  }
)
const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connection Established!')
})


/**** APP ****/
const app = express()

//Middlewares
app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', authenticate, express.static('uploads'))


//Start listening
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
});


//Import routes
const preroute = process.env.PREROUTE || ""


app.use(`${preroute}/`, AuthRoute)
app.use(`${preroute}/users`, authenticate, UsersRoute)
app.use(`${preroute}/brands`, authenticate, BrandsRoute)
