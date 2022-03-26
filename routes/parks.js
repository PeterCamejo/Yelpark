const express = require('express');
const router = express.Router();
const parkControl = require('../controllers/parks');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isOwner, validatePark} = require('../middleware');
const multer = require('multer');
const {storage} = require('../images');
const upload = multer({storage});

const Park = require('../models/park');


//Index
router.get('/', catchAsync(parkControl.index));

//Render New form
router.get('/new', isLoggedIn, parkControl.renderNew);

//Create TODO: make validatePark middleware work before Multer middleware
router.post('/', isLoggedIn, upload.array('image'), validatePark, catchAsync(parkControl.create));

//Show
router.get('/:id', catchAsync(parkControl.show));

//Render Edit form
router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(parkControl.renderEdit));

//Update
router.put('/:id/', isLoggedIn, isOwner, upload.array('image'), validatePark, catchAsync(parkControl.update));

//Delete
router.delete('/:id', isLoggedIn, isOwner, catchAsync(parkControl.delete));

module.exports = router;