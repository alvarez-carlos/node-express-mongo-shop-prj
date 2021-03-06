const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const User = require('../models/user')

const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')


// sign up
router.post('/signup', (req, res, next) => {
    const { email, password } = req.body
    // console.log(email)
    // console.log(password)

    // User.find({ email })
    User.findOne({ email })
    .exec()
    .then(result => {
        // if (result.length >= 1) {
        if (result) {
            return res.status(422).json({
                message: 'Mail exists'
            })
        } else{
            bcrypt.hash(password, 10, (err, hash) => {
                // console.log('step1')
                if (err) {
                    // console.log('step2')
                    return res.status(500).json({
                        error: err
                    })
                }
                else{
                    // console.log('step3')
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: email,
                        password: hash
                    })
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(201).json({message: 'created'})
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({error: err})
                    })
                }
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })


    
})

// sign in
router.post('/login', (req, res, next) => {
    const { email, password } = req.body
    User.findOne({ email })
    .exec()
    .then(result => {
        if (!result){
            return res.status(401).json({
                message: 'Auth Failed'
            })
        }
        //match password to then generate the token and login the user
        bcrypt.compare(password, result.password, (err, response) => {
            if (err){
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            if (response){
                const token = jwt.sign(
                    {
                        email: result.email,
                        userId: result._id
                    },
                    // process.env.JWT_KEY,
                    'my_secret_key',
                    {
                        expiresIn: "1h"
                    }
                )
                return res.status(200).json({
                    message: 'Auth Successful',
                    token
                })
            }
            return res.status(401).json({
                message: 'Auth Failed'
            })
        })
    })
})





// delete user
router.delete('/:id', (req, res, next) => {
    const { _id } = req.params.id
    User.remove({ id })
    .exec()
    .then(result => {
        res.status.length(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router