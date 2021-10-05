const express = require ('express');
const router =  express.Router();
const auth = require ('../../middleware/auth');
const User = require('../../models/User');
const {check , validationResult} = require ('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const config = require ('config');

router.get ('/' , auth, async (req,res) => {
    try {
        const UserInfo = await User.findById (req.user.id).select('-password');
        res.json({UserInfo});
    }
    catch (err)
    {
        console.error(err.messsage);
        res.sendStatus(500).send('Server Error');
    }
});
router.post ('/' , [
    

    check('email' , 'Please Enter a valid Email Addresss').isEmail(),

    check('password' , 'please enter a password')
    .exists()
],async (req,res) => {
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400)
        .json({errors : errors.array()})
    
    }
    const {name , email , password} = req.body;
    
    try {
        

        let user = await User.findOne({email : email});
        
        if(!user)
        {
            return res.status(400).json({errors : [{msg: "Invalid Credentials"}]});
        }
       
        const validPassword =  await bcrypt.compare(req.body.password.toString(), user.password );
        
        if(!validPassword)
        {
            res.status(400).json({errors : [{msg: "password Invalid Credentials"}]});
        }
        const payload = {
            user : {
                id : user.id
            }
        }
         jwt.sign(payload , config.get('jwtSecret') , { expiresIn : 36000} , (err ,token) => {
            if (err) throw err;
            res.json({token});
        })
       
    }
    catch (err)
    {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
