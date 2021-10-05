const jwt = require ('jsonwebtoken');
const config = require ('config');
const User = require('../models/User');

module.exports = function ( req , res , next){

    const token = req.header('x-auth-token');

    if(!token)
    {
        res.status(401).json({msg : 'token not available'})
    }
    try {
    const decodedToken = jwt.verify(token , config.get('jwtSecret'));

    req.user = decodedToken.user;
    next();
    }
    catch (err)
    {
        res.status(401).json({msg : 'Invalid token'})
    }

}