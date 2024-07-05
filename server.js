// Imports
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

// Models
const Car = require('./models/car.js')

// Constants
const app = express()

// Middleware
app.use(morgan('dev'))
// Without below line, req.body will always bec undefined. VERY IMPORTANT!!!
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')

// Routes
//  GET /
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/cars/new', async (req, res) => {
    const cars = await Car.find(req.body)
    res.render('cars/new')
})

// Cars/create
app.post('/Cars', async (req, res) => {
    req.body.isReadyToDrive = Boolean(req.body.isReadyToDrive)
    const createdCar = await Car.create(req.body)
    res.redirect('/cars/new')
})

// Cars/index
app.get('/cars', async (req, res) => {
    const allCars = await Car.find({})
    res.render('cars/index', { cars: allCars})
})

// Cars/search
app.get('/cars/search', async (req, res) => {
    const { name, isReadyToDrive, drivetrain } = req.query
    let searchCriteria = {}

    if (name) searchCriteria.name = new RegExp(name, 'i')
    if (isReadyToDrive !== "") searchCriteria.isReadyToDrive = isReadyToDrive === 'true'
    if (drivetrain) searchCriteria.drivetrain = new RegExp(drivetrain, 'i')

    const searchResults = await Car.find(searchCriteria)
    res.render('cars/index', { cars: searchResults })
})

// Cars/delete
app.delete('/cars/:id', async (req, res) => {
    await Car.findByIdAndDelete(req.params.id)
    res.redirect('/cars')
})


// Server connections
const connect = async () => {
    try {
        // MONGODB connection
        await mongoose.connect(process.env.MONGODB)
        // Express server connection
        app.listen(process.env.PORT, () => {
            console.log(`Server up and running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
 
connect()