const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user.js");

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require("passport");

// Ensure login for private route 
const ensureLogin = require("connect-ensure-login");

/** SIGNUP page */
passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup')
})

/* post SIGNUP */
passportRouter.post('/signup', (req, res) => {
  const password = req.body.password;
  const username = req.body.username; 

  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({
        username: username,
        password: hash
      })
    })
    .then(user => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
})

/*  LOGIN page */
passportRouter.get('/login', (req, res) => {
  res.render('passport/login')
})

/*  post LOGIN */
// passportRouter.post('/login', (req, res) => {
//   let currentUser;
//   User.findOne({username: req.body.username})
//     .then(user => {
//       console.log(user)
//       if(!user) {
//         res.send("user not found");
//         return
//       }
//       currentUser = user;
//       return bcrypt.compare(req.body.password, user.password)
//     })
//     .then(passwordCorrect => {
//       if(passwordCorrect) {
//         req.session.currentUser = currentUser
//         res.redirect("passport/private")
//       } else {
//         res.send("incorrect password");
//       }
//     })
// })
passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: '/auth/login'
}))

/* MEMBERS page */
passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;