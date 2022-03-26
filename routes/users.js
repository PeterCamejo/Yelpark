const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const userControl = require('../controllers/users');

//Render Register Form
router.get('/register', userControl.renderRegistration);

//Register
router.post('/register', catchAsync( userControl.register));

//Render Login Form
router.get('/login', userControl.renderLogin);

//Login
router.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), userControl.login)

//Logout
router.get('/logout', userControl.logout);

module.exports = router;