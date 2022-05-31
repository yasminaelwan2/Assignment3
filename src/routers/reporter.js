const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middelware/auth')
const multer = require('multer')
///////////////////////////////////////////////////////
router.post('/signup',async (req,res)=>{
    try{
        const reporter = new Reporter(req.body) 
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})
//////////////////////////////////////////////////////////////

// login

router.post('/login',async (req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.send({reporter,token})
    }
    catch(e){
        res.send(e.message)
    }
})

////////////////////////////////////////////////////////////////////////////
// profile
router.get('/profile',auth,async(req,res)=>{
    try{
        res.send(req.reporter)
    }
    catch(e){
        res.status(500).send(e.message)
    }
    
})

//////////////////////////////////////////////////////////////////////////

// logout 
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

////////////////////////////////////////////////////////////////
// get

router.get('/reporters',auth,(req,res)=>{
    Reporter.find({}).then((reporter)=>{
        res.status(200).send(reporter)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
/////////////////////////////////////
// get by id
router.get('/reporters/:id',auth,(req,res)=>{
    const _id = req.params.id
    User.findById(_id).then((reporter)=>{
        if(!reporter){
        return res.status(404).send('Unable to find user')
        }
        res.status(200).send(reporter)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
////////////////////////////////////////////////////////
router.patch('/reporter/:id',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body) 
        console.log(updates)
        const reporter = await Reporter.findById(req.params.id)
        if(!reporter){
            return res.status(404).send('No user is found')
        }
        updates.forEach((el)=> reporter[el]=req.body[el])
        await reporter.save()
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

////////////////////////////////////////////////////////////////////////////
router.delete('/reporters/:id',auth,async(req,res)=>{
    try{
        const reporter = await Reporter.findByIdAndDelete(req.params.id)
        if(!reporter){
            return res.status(404).send('Not found')
        }
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(500).send(e.message)
    }
     
})

///////////////////////////////////////////////////////////////////////
router.get('/mynews',auth,async(req,res)=>{
    try{
        await req.reporter.populate('news')
        res.send(req.reporter.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

/////////////////////////////////////////////////////////////////////////
const uploads = multer({
    limits:{
        fileSize:1000000 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|jfif|png)$/)){
            cb(new Error('Please upload image'))
        }
        cb(null,true)
    }
})
///////////////////////////////////////////
router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

module.exports = router

