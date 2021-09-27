const express = require ('express');
const router =  express.Router();
const gravatar = require ('gravatar');
const bcrypt = require('bcryptjs');
const {check , validationResult} = require ('express-validator');

const User = require('../../models/User');


router.post ('/' , [
    check('name' , 'Please Enter your name')
    .not().isEmpty(),

    check('email' , 'Please Enter a valid Email Addresss').isEmail(),

    check('password' , 'Please enter a password of more than or equal to 8 characters')
    .isLength({min : 8})
],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400)
        .json({errors : errors.array()})
    
    }
    const {name , email , password} = req.body;
    try {
        

        let user = await User.findOne({email});
        if(user)
        {
            return res.status(400).json({errors : [{msg: "User Already Exists"}]});
        }
        const avatar = gravatar.url(email,{
            s : '200',
            r : 'pg',
            d : 'mm'
        })
        user = new User ({
            name,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        res.send('UserRegisterd')
    }
    catch (err)
    {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
