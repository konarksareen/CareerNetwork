const express = require ('express');
const router =  express.Router();
const Profile = require ('../../models/Profile');
const User = require ('../../models/User');
const Auth = require ('../../middleware/auth');
const {check , validationResult} = require('express-validator');

router.get ('/me' , Auth, async (req,res) => {
 try {
 const userProfile = await Profile.findOne ( {user : req.user.id}).populate('user' , ['name' , 'gravatar']);
 if (!userProfile)
 {
     res.status(200).send('No user found');
 }
 else {
     res.json();
 }
 }
 catch (err)
 {
     console.error(err);
 }
});

router.post ('/' ,[Auth ,
check('status' , 'Please Enter your current status').not().isEmpty(),
check('skills' , 'Please Add Some Skills').not().isEmpty()
] ,async (req,res) => {
const errors = validationResult(req);
 if(!errors.isEmpty())
 {
     
     res.status(500).json({errors : errors.array});
 }
 const {
    website,
    skills,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
    
    ...rest
  } = req.body;

  
  const profileFields = {
    user: req.user.id,
    website:
      website && website !== ''
        ? normalize(website, { forceHttps: true })
        : '',
    skills: Array.isArray(skills)
      ? skills
      : skills.split(',').map((skill) => ' ' + skill.trim()),
    ...rest
  };

 
  const socialFields = { youtube, twitter, instagram, linkedin, facebook };

  // normalize social fields to ensure valid url
  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0)
      socialFields[key] = normalize(value, { forceHttps: true });
  }
  
  profileFields.social = socialFields;

  try {
      let profile = await Profile.findOneAndUpdate (
          {user : req.user.id },
      {$set : profileFields},
      {new : true , upsert : true , setDefaultsOnInsert : true});
      res.json(profile);

  }catch(err)
  {
      console.error(err);
  }

})

router.get ('/users' , async (req,res) => {

try {
    let profiles = await Profile.find().populate('user' , ['name' ,'gravatar']);
    res.json(profiles);

}catch(err)
{
    console.error(err);
}
})

router.post ('/user/:user_id' , async(req,res) => {

    try {
        const profile = await Profile.findOne( {user : req.params.user_id} ).populate('user' , ['name' , 'gravatar']);
        if(!profile)
        {
            console.log('here');
            res.status(400).send('Profile not found');
        }
        res.json(profile);
        
    }catch (err)
    {
        if(err.kind == 'ObjectId')
        {
            res.status(400).send('Profile not found');
        }
        console.error(err);
    }
})

router.delete ('/' , async (req,res) => {

    try {
        //Remove profile
         await Profile.findOneAndRemove({ user : req.user.id});

         //Remove User
         await User.findOneAndRemove( { _id : req.user.id});

        res.json({msg : "User Deleted"});
    
    }catch(err)
    {
        console.error(err);
    }
    })

    router.put ('/experience' ,  [Auth ,
    check('title' , 'Please add a title').not().isEmpty(),
    check('company' , 'Please Enter the company name').not().isEmpty(),
    check('from' , 'Please Enter start date').not().isEmpty()
] ,async (req,res) => {

    const {
        title,
        company, 
        location,
        description,
        from,
        to,
        current
    } = req.body;
    const newExp = {
        title,
        company, 
        location,
        description,
        from,
        to,
        current
    }
        try {
            
           const profile = await Profile.findOne ({user : req.user.id});
           
           profile.experience.unshift(newExp);

           await profile.save();
           res.json(profile);
        
        }catch(err)
        {
            console.error(err);
            res.status(500).send('Server Error');
        }
        })   

router.delete ('/experience/:exp_id' , Auth , async (req,res) =>{
    try {
        const profile = await Profile.findOne ( {user : req.user.id});

        const exp = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(exp,1);
         await profile.save();
         res.json(profile);
    }catch(err)
    {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

router.put ('/education' ,  [Auth ,
    check('school' , 'Please Enter School / College name').not().isEmpty(),
    check('degree' , 'Please Enter the course').not().isEmpty()
] ,async (req,res) => {

    const {
       school,
       degree,
       fieldofstudy,
        description,
        from,
        to,
        current
    } = req.body;
    const newEdu= {
        school,
       degree,
        fieldofstudy,
        description,
        from,
        to,
        current
    }
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty())
            {
                res.status(400).json({errors : errors.array()});
            }
            
           const profile = await Profile.findOne ({user : req.user.id});
           
           profile.education.unshift(newEdu);

           await profile.save();
           res.json(profile);
        
        }catch(err)
        {
            console.error(err);
            res.status(500).send('Server Error');
        }
        })   

        router.delete ('/education/:edu_id' , Auth , async (req,res) =>{
            try {
                const profile = await Profile.findOne ( {user : req.user.id});
        
                const edu = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        
                profile.education.splice(edu,1);
                 await profile.save();
                 res.json(profile);
            }catch(err)
            {
                console.error(err);
                res.status(500).send('Server Error');
            }
        })
module.exports = router;
