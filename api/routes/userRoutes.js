const express   = require('express');
const connection= require('../../config/db').connection;
const route     = express.Router();
const userCtrl  = require('../controllers/userController');
const checkauth = require('../middleware/checkauth')


route.get('/', checkauth, userCtrl.getUsers);

route.post('/register',userCtrl.register);

route.get('/:userId', checkauth, userCtrl.getUserById);

route.post('/login',userCtrl.signin);

module.exports = route;
