const jwt = require ('jsonwebtoken');

const User = require ('../models/User');

//protected routes
module.exports.requireAuth = ( req, res, next) => {

    const token = req.cookies.jwt;
    const secretString = 'Hello am rickside and am a node developer'; 

if (token) {
    jwt.verify(token,secretString, (err,decodedtoken) => {
        if (err) {
            console.log(err.message);
            res.redirect('/login');
        }else{

            console.log(decodedtoken);
            next();
        }
    });
       
}else{
    res.redirect('/login');
}
}

//check user
module.exports.checkuser = ( req, res, next) => {

    const token = req.cookies.jwt;
    const secretString = 'Hello am rickside and am a node developer'; 

if (token) {
    jwt.verify(token,secretString, async (err,decodedtoken) => {
        if (err) {
            console.log(err.message);
            res.locals.user = null;
            next();
        }else{

            console.log(decodedtoken);
            const user = await User.findById(decodedtoken.id);
            res.locals.user = user;
            next();
        }
    });
       
}else{
    res.locals.user = null;
    next();
}
}