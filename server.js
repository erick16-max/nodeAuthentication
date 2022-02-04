const express = require ('express');
const mongoose = require ('mongoose');
const ejs = require ('ejs');
const cookieParser = require('cookie-parser');

const userRouter = require ('./routers/userRouter')
const {uri} = require ('./config/db');
const {requireAuth , checkuser} = require ('./middleware/authMiddleware')

//app creation
const app = express();

//use middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//set view engine
app.set('view engine', 'ejs');

const port = process.env.port || 5000;



mongoose.connect(uri)
    .then(result => {
        app.listen(port, ()=> {
            console.log(`The server is listening at port ${port}`);
        })
    })
    .catch(err => console.log(err))

//Routes
app.get('*' , checkuser)
app.get('/', (req,res) => {
    res.render('home' , {title:'home'})
});
app.get('/blog' ,requireAuth, (req,res) => {
    res.render('blog', {title:'blog'})
})
app.use(userRouter);

// app.get('/set-cookies', (req,res) => {
//    res.setHeader('Set-Cookie','newUser = false');
//     res.cookie('admin', true,{httpOnly:true});
//     res.cookie('newUser', false);
//     res.send('cookie set');
// });

// app.get('/get-cookies', (req,res) => {
// const cookies = req.cookies;
// console.log(cookies);
// res.json(cookies);
// })