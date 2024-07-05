// Do these first 
const { name } = require('ejs')
const mongoose = require('mongoose')

// Do second, define schema
const carSchema = new mongoose.Schema({
    name: String,
    isReadyToDrive: Boolean,
    drivetrain: String,
})

// 3rd is this
const Car = mongoose.model('Car', carSchema)

// Then finally export it 
module.exports = Car