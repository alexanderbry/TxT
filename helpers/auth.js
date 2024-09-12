const express = require('express')

const auth = function (req, res, next){
    if(req.session.userId){
        next()
    } else {
        const err = "Please log-in first!"
        res.redirect(`/login?error=${err}`)
    }
}

module.exports = auth