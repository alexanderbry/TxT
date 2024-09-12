const express = require('express')
const router = require("./routers/index")
const session = require("express-session")
const multer  = require('multer')
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

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "kevinporosdunia",
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))
app.use('/', router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})