const express = require('express')

const router = express.Router()

const Product = require('../models/product')
const mongoose = require('mongoose')

// multer
const multer = require('multer')

// cb(null, file.filename)
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})


const fileFilter = (req, file, cb) => {
    
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
        ) {
        //accept and store the file
        cb(null, true)
    }
    else{
        //reject a file
        cb(null, false)
    }    
}

// 1024 * 1024 = 1Megabite => 1024* 1024 * 5 = 5 megabites
// const upload = multer({storage: storage, limits: {
//     fileSize: 1024 * 1024 * 5
// }})

const upload = multer(
    {
        storage: storage, 
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    })



// const upload = multer({dest: 'uploads/'})





router.get('/', (req, res, next) => {

    Product.find() // .where , .limit   we could use more query operators
    .select('name price _id productImage')
    .exec()
    .then(result => {
        const response = {
            count: result.length,
            products: result.map(product => {
                return {
                    // ...product,
                    name: product.name,
                    price: product.price,
                    _id: product._id,
                    priductImage: product.productImage,
                    url: {
                        type: 'GET',
                        url: `http://localhost/:3000/products/${product._id}`
                    }
                }
            })
        }
        res.status(200).json({response})      
    })
    
    .catch(err => {
        console.log('FROM DB: ', err)
        res.status(500).json({
            error: err
        })
    })

})

router.get('/:id', (req, res, next) => {
   const _id = req.params.id
//    Product.findOne({ _id })
   Product.findById(_id)
   .exec()
   .then( result => {
       console.log('From DB: ', result)
       if (result){
            res.status(200).json({
                message: 'Handling GET requests for /products/id',
                product: result
            })
       }
       else{
            res.status(404).json({
                message: 'No valid entrty found for provided ID'
            })
       }
   })
   .catch(err => {
       console.log(err)
       res.status(500).json({
           error: err
       })
   })
})

router.post('/', upload.single('productImage'), (req, res, next) => {
    // console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save() //save is a method provided by mongoose to be used on mongoose models to store them in the b. 
    // .exec() // exec will turn thei request into a promise. DO not need to use exec()
    // We instead use promise
    .then( result => {
        console.log(result)
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: product
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

// router.put('/:id', (req, res, next) => {
//     res.status(200).json({
//         message:'Hello from Put',   
//         body: req.body,
//         id: req.params.id
//     })
// })

router.patch('/:id', (req, res, next) => {
    // const { name, price } = req.body
    const _id = req.params.id
    const updateProps = {};
    for (const props of req.body){
        updateProps[props.propName] = props.value
    }

    Product.findByIdAndUpdate({ _id }, { $set: updateProps })
    // Product.update({ _id }, { $set: updateProps })
    .exec()
    .then(result => {
        console.log('From DB: ', result)
        res.status(200).json({
            message: 'Handling PATCH requests to /products',
            result: result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:id', (req, res, next) => {
    const _id = req.params.id
    // Product.findByIdAndDelete({ _id })
    Product.remove({ _id })
    .exec()
    .then(result => {
        console.log('From DB: ', result)
        res.status(200).json({
            message: 'Handling DELETE requests to /products',
            result: result
        })
    })
    .catch(err => {
        console.log('Error', err)
        res.status(500).json({
            message: 'Error on handling DELETE requests to /products',
            error: err
        })
    })
})


module.exports = router