const mongoose = require ('mongoose');
const {isEmail}        = require('validator');
const bcrypt = require ('bcrypt');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        require:[true, 'Please enter an Email'],
        unique:true,
        lowercase:true,
        validate: [isEmail,'Enter a valid email']
    },
    password:{
        type:String,
        require:[true, 'Please enter a Password'],
        unique:true, 
        minlength:[6,'minimum character should be 6']
    }
});

//encryption of the password using bcrypt
userSchema.pre('save', async function(next) {
const salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password,salt);

    next();
})

//Log in user function
userSchema.statics.login = async function(email, password){
    const user = await User.findOne({email});
    if (user) {
       const auth = await bcrypt.compare(password,user.password);
       if (auth) {
           return user;
       }
       throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('User',userSchema);

module.exports = User;