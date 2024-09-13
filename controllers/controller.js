const { Model } = require("sequelize")
const { User, Profile, PostHashtag, Post, Hashtag} = require("../models/index")
const { post } = require("../routers")
const bcrypt = require('bcrypt');
const user = require("../models/user");

class Controller {
    // Landing Page
    static async landingPage(req, res){
        try {
            res.render("landingPage")
        } catch (error) {
            res.send(error.message)
        }
    }
    // Register
    static async registerForm(req, res){
        try {
            res.render("register")
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postRegister(req, res){
        try {
            
            let { username, email, password } = req.body
            let user = await User.create({username, email, password})
            
            let id = user.id
            res.redirect(`/profileAdd/${id}`)
        } catch (error) {
            res.send(error.message)
        }
    }
    // Profile Setup
    static async profileAddForm(req, res){
        try {
            let { id } = req.params
           
            res.render("profileAdd", {id})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postAddProfile(req, res){
        try {
            let { id } = req.params
            let UserId = id
            let { name, dateOfBirth, gender, imgUrl } = req.body
            if(!imgUrl){
                imgUrl = "https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
            }
            await Profile.create({name, dateOfBirth, gender, imgUrl, UserId})
            
            res.redirect("/login")
        } catch (error) {
            res.send(error.message)
        }
    }
    // Login
    static async loginForm(req, res){
        try {
            let {error} = req.query

            res.render("login", {error})
        } catch (error) {
            res.send(error.message)
        }
    }
    static async postLogin(req, res){
        try {
            let { username, password } = req.body
            let user = await User.findOne({where: {username}})
            if(user){

                let validPw = await bcrypt.compare(password, user.password)
                
                if(validPw){
                    req.session.userId = user.id;
                    req.session.userRole = user.role;
                    res.redirect("/home")
                } else {
                    const err = "Invalid username/password"
                    res.redirect(`/login?error=${err}`)
                }
            }
        } catch (error) {
            res.send(error.message)
        }
    }
    // Home
    static async home(req, res){
        try {
            let sessionUserId = req.session.userId
            let sessionUserRole = req.session.userRole
            let {deleted} = req.query

            let user = await User.findByPk(sessionUserId, {
                include : [Profile]
            })

            let posts = await Post.findAll({
                include : [{
                    model : User,
                    include : Profile
                },{
                    model : PostHashtag,
                    include : Hashtag
                }],
                order : [["createdAt", "DESC"]]
            })

            res.render("home", {user, posts, deleted})
        } catch (error) {
            res.send(error.message)
        }
    }

    // Update
    static async update(req, res){
        try {
            let sessionUserId = req.session.userId
            let sessionUserRole = req.session.userRole
            let { id } = req.params
            let { like, dislike } = req.query

            let post = await Post.findByPk(id)
            
            if(like){
                await post.increment({like:1})
            }
            if(dislike){
                await post.increment({dislike:1})
            }

            res.redirect("/home")
        } catch (error) {
            res.send(error.message)
        }
    }

    // Post
    static async post(req, res){
        try {
            let { text, name } = req.body
            let { id } = req.params
            let path = req.file;
            let UserId = id
            let postImg = "https://picsum.photos/200/300?grayscale"

            if(req.file){
                postImg = path.path
            }
 


            await Post.create({text, postImg, UserId})
            await Hashtag.create({name})

            res.redirect("/home")
        } catch (error) {
            res.send(error.message)
        }
    }

    // Delete
    static async delete(req, res){
        try {
            let { id } = req.params
            
            let data = await Post.findByPk(id, {
                include : {
                    model : User,
                    include : Profile
                }
            })

            await Post.destroy({
                where : {id}
            })
            
            let deleted = data.User.Profile.name
            res.redirect(`/home?deleted=${deleted}`)
        } catch (error) {
            res.send(error.message)
        }
    }

    // Profile
    static async profile(req, res){
        try {
            let { id } = req.params

            let profile = await Profile.findByPk(id,{
                include : {
                    model : User,
                    include : Post
                }
            })

            res.render("profile", {profile})
        } catch (error) {
            res.send(error.message)
        }
    }

    // Search
    static async search(req, res){
        try {
            let { name } = req.query
            
            let profiles = await Profile.searchName(name)
            
            res.render("search", { profiles })
        } catch (error) {
            res.send(error.message)
        }
    }

    static async upload(req, res){
        try {
            req.send("Uploaded image")
        } catch (error) {
            res.send(error.message)
        }
    }

    // Logout
    static async logout(req, res){
        try {
            req.session.destroy(err => { 
                if(err){
                    throw new Error("Error while logging out")
                } else {
                    res.redirect("/")
                }
            })
        } catch (error) {
            res.send(error.message)
        }
    }
}

module.exports = Controller