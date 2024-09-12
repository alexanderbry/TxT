const express = require('express')
const router = express.Router()
const Controller = require("../controllers/controller")
const auth = require("../helpers/auth")
const multer  = require('multer')
const path = require("path")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  fileFilter:(req,file,cb)=>{
    const allowedFileType = ["jpg", "jpeg", "png"];
    if(allowedFileType.includes(file.mimetype.split("/")[1])){
        cb(null,true)
    }else{
        cb(null,false)
    }
    }
})
const upload = multer({ storage })

// Landing Page
router.get('/', Controller.landingPage)

// Register
router.get('/register', Controller.registerForm)
router.post('/register', Controller.postRegister)

// login
router.get('/login', Controller.loginForm)
router.post('/login', Controller.postLogin)

// Profile Add
router.get('/profileAdd/:id', Controller.profileAddForm)
router.post('/profileAdd/:id', Controller.postAddProfile)

// Auth (Middleware)
router.use(auth)

// Home
router.get('/home', Controller.home)

// Logout
router.get('/logout', Controller.logout)

// Search
router.get('/search', Controller.search)

// Upload
router.post('/search', upload.single("fileName"),Controller.upload)

// Update
router.get('/home/:id', Controller.update)

// Profile
router.get('/profile/:id', Controller.profile)

// Post
router.post('/post/:id',upload.single('postImg'), Controller.post)

// Delete
router.get('/post/:id/delete', Controller.delete)

module.exports = router