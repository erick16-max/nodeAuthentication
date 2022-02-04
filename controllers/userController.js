
const User = require('../models/User');
const jwt = require ('jsonwebtoken');
const res = require('express/lib/response');

//handle errors
const errorHandler = (err) => {
    console.log(err.message,err.code);
    //validatiom of errors
    const error = {email:'',password:''};

     //email exist
     if (err.code===11000){
        error['email']="Email already exists";
        return error;
    }

    //email already exists when user login error
    if (err.message === 'incorrect email') {
        error.email = 'The email is not registred';
    }

    //password incorrect when user login error
    if (err.message === 'incorrect password') {
        error.email = 'The password entered is incorrect';
    }

    //all fields validation
    if(err.message.includes("User validation failed")){
        Object.values(err.errors).forEach(({properties}) => {
            error[properties.path] = properties.message;
        });
    }
    return error;
}

//creating a jwt function
const maxAge = 3 * 24 * 60 * 60 ;
const secretString = 'Hello am rickside and am a node developer';
const createToken = id =>{
    return jwt.sign({id},secretString,{
        expiresIn:maxAge
    });
}

//get handler for sign in
module.exports.signup_get = (req,res) => {
    res.render('signup' ,{title:'signup'});
}

//get handler for login
module.exports.login_get = (req,res) => {
    res.render('login' ,{title:'login'})
}

//sign in post
module.exports.signup_post = async (req,res) => {
   const {email,password} = req.body;

   try{
      const user = await User.create({email,password});
      const token = createToken(user._id);
      res.cookie ('jwt', token , {httpOnly:true, maxAge:maxAge * 1000});
      res.status(201).json({user});
   }
   catch(err){
   const errors = errorHandler(err);
    res.status(400).json({errors})
   }
}

    //login post
    module.exports.login_post = async (req,res) => {
     const {email,password} = req.body;
    
        try {
            const user = await User.login(email,password);
            const token = createToken(user._id);
            res.cookie ('jwt', token , {httpOnly:true, maxAge:maxAge * 1000});
            res.status(200).json({user:user._id});
        } catch (err) {
          const errors = errorHandler(err);
          res.status(400).json({errors})  
        }
      
     }

     //logout get
     module.exports.logout_get = (req, res) => {
         res.cookie('jwt','', {maxAge:1});
         res.redirect('/');
     }
      
      
