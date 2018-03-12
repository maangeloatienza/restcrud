const connection            = require('../../config/db').connection;
const bcrypt                = require('bcrypt');
const jwt                   = require('jsonwebtoken');


process.env.JWT_KEY = 'secret';

function checkEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}

/* 

    GET USERS

 */

exports.getUsers = (req,res,next)=>{
    let sql = `SELECT * FROM users`;

    connection.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({
                message : "Error fetching data"
            });
        }
        res.status(200).json({
            message     : 'Success fetching data',
            data        : result
        });
    });
};

/* 

    ADD USERS

*/
exports.register = (req,res,next)=>{
    
    let fetchData = req.body;
    let pass = fetchData.password;
    let email = fetchData.email;
    let users = {};

    bcrypt.hash(pass,10,(err,hash)=>{
        if(err){
            return res.status(401).json({
                message         : 'authenticationFailed'
            });
        }
        users = {
            email       : checkEmail(email),
            password    : hash,
            firstName   : fetchData.firstName,
            lastName    : fetchData.lastName
        };
        let chkQuery = `SELECT email FROM users WHERE email = ?`;
        let insQuery = `INSERT INTO users(email, password, firstName, lastName) VALUES(?, ?, ?, ?)`;

        connection.query(chkQuery,[users.email],(err,result)=>{
            if(err){
                return res.status(500).json({
                    message: "authenticationFailed"
                });
            }

            if(result.length > 0 ){
                res.status(403).json({
                    message : "forbidden"
                })
            }else{
                connection.query(insQuery, [users.email, users.password, users.firstName, users.lastName],(err,result)=>{
                    if(err){
                        return res.status(500).json({
                            message : "addingDataFailed"
                        });
                    }
                    res.status(200).json({
                        message: "signUpSuccess",
                        data: result    
                    });
                    
                });
            }   
        });
    });
};

/* 


    GET USER BY ID


 */

exports.getUserById = (req,res,next)=>{
    let id = req.params.userId;

    let getUser = `SELECT * FROM users WHERE userId = ${id}`;

    connection.query(getUser,(err,result)=>{
        if(err){
            return res.status(500).json({
                message : 'fetchingDatafailed'
            });
        }
        res.status(200).json({
            message : 'dataFetchingSuccess',
            data : result
        });
    });
};

/* 


    LOGIN USER


*/

exports.signin = (req,res,next)=>{
    let fetchData = req.body;
    let login = {
        email : fetchData.email,
        password : fetchData.password
    };
    let lgnQuery = `SELECT * FROM users WHERE email = ?`;

    connection.query(lgnQuery,[login.email],(err,user)=>{
        if(err){
            return res.status(500).json({
                message     : "loginFailed"
            });
        }

        if(user.length <= 0 ){
            return res.status(401).json({
                message     : "authenticationFailed"
            });
        }else {
            bcrypt.compare(login.password, user[0].password, (err,result)=>{
                if(err){
                    return res.status(401).json({
                        message     : "authenticationFailed",
                    });
                }

                if(result){
                    const token = jwt.sign({
                        email       : user[0].email,
                        password    : user[0].password
                    }, process.env.JWT_KEY,{
                        expiresIn   : '1h'
                    });

                    return res.status(200).json({
                        message : "authenticationSuccess",
                        token   : token
                    });
                }

                res.status(404).json({
                    message     : "loginInfoNotAvailable",
                    token       : token
                });
            });
        }
    });
}; 