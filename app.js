const express       = require('express');
const bodyParser    = require('body-parser');
const morgan        = require('morgan');

const app           = express();

const userRouter    = require('./api/routes/userRoutes');

process.env.JWT_KEY = 'secret';

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

app.use('/user',userRouter);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Authorization');

    next();

});

module.exports = app;