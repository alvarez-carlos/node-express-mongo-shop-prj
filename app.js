const express = require('express')
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const products = require('./api/routes/products')
const orders = require('./api/routes/orders')
const users = require('./api/routes/users')


mongoose.connect('mongodb+srv://taskcarlos:vKi759EkWU37QjUE@cluster0.imo0m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.use(morgan('dev')) 

app.use('/uploads', express.static('uploads'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()) 

app.use((req, res, next) => {
    
    
    /* The * gives access  to any origin.*/
    res.header('Access-Control-Allow-Origin', '*') 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization') 

    if(req.method === 'OPTIONS'){
        
        res.header('Access-Control-Methods', 'PUT, POST, PATCH, DELETE, GET')

        
        return res.status(200).json({}) 
    }
    next()
}) 


app.use('/products', products)
app.use('/orders', orders)
app.use('/auth', users)

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404 
    next(error) 
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)   
    res.json({
        error:{
            message: error.message
        }
    })
})


module.exports = app


