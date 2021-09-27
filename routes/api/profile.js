const express = require ('express');
const router =  express.Router();

router.get ('/' , (req,res) => (console.log('profile route')));

module.exports = router;
