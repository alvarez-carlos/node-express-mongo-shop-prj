const express = require('express')

const router = express.Router()

const Order = require('../models/order')
const Product = require('../models/product')

const mongoose = require('mongoose')




router.get('/', (req, res, next) => {

    Order.find() // .where , .limit   we could use more query operators
    .select('product quantity _id')
    // .populate('product')
    .populate('product', 'name')
    .exec()
    .then(result => {
       
        const response = {
            count: result.length,
            orders: result.map(order => {
                return {
                    // ...order,
                    product: order.product,
                    quantity: order.quantity,
                    _id: order._id,
                    url: {
                        type: 'GET',
                        url: `http://localhost/:3000/orders/${order._id}`
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
//    Order.findOne({ _id })
   Order.findById(_id)
    .populate('product')
   .exec()
   .then( result => {
        if (!result){
            return res.status(404).json({
                message: 'Order not Found'
            })
        }
       console.log('From DB: ', result)
       if (result){
            res.status(200).json({
                message: 'Handling GET requests for /orders/id',
                order: result
            })
       }
       else{
            res.status(404).json({
                message: 'No valid entry found for provided ID'
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


router.post('/', (req, res, next) => {
    Product.findById(req.body.product)
    // console.log(req.body.productId)
    .then(result => {

        if (!result){
            return res.status(404).json({
                message: 'Product Not found'
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.product,
            quantity: req.body.quantity
        })
    
        return order.save() //return another promise to handled below
      
    })

    .then( result => {
        console.log(result)
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

    // .catch(err => {
    //     res.status(500).json({error: 'Product NOT found'})
    // })
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

    Order.findByIdAndUpdate({ _id }, { $set: updateProps })
    // Order.update({ _id }, { $set: updateProps })
    .exec()
    .then(result => {
        console.log('From DB: ', result)
        res.status(200).json({
            message: 'Handling PATCH requests to /orders',
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
    Order.findByIdAndDelete({ _id })
    // Order.remove({ _id })  // deprecated : use remoteOne or findByIdAndDelete instead...
    // console.log( _id )
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