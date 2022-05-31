const express = require('express')
const router = express.Router()
const auth = require('../middelware/auth')
const News = require('../models/news')
const multer = require('multer')

// create news
router.post('/news',auth,async(req,res)=>{
    try{
        const news = new News({...req.body,owner:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
///////////////////////////////////////////////////////////////////

router.get('/news',auth,async(req,res)=>{
    try{
        await req.reporter.populate('news')
        res.send(req.reporter.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

//////////////////////////////////////////////////////////////////////////

router.get('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await Task.findOne({_id,owner:req.reporter._id})
        if(!news){
            return  res.status(404).send('No news is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

////////////////////////////////////////////////////////////////

router.patch('/news',auth,async(req,res)=>{
    try{
        
        const updates = Object.keys(req.body)
        const news= await News.findOne({owner:req.reporter._id})
        if(!news){
            return res.status(404).send('No news')
        }
        updates.forEach((el)=> news[el]=req.body[el])
        await news.save()
        res.send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

/////////////////////////////////////////////////////////////////////////

router.delete('/news/:id',auth,async(req,res)=>{
    
 try{
     const _id = req.params.id
        const news = await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
          return  res.status(404).send('No newk is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
//////////////////////////////////////////////////
router.get('/reporterData/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            res.status(404).send('No news is found')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
///////////////////////////////////////////
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