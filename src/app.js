
const express = require('express')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const News = require('./models/news')
const Reporter = require('./models/reporter')
const app = express()
const port = process.env.PORT || 3000

require('./db/mongoose') 
app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)

///////////////////////////////////////////////////////////////////////

// Hash password
// bcryptjs

// const bcryptjs = require('bcryptjs')
// const passwordFunction = async () =>{
//     const password = 'R123456'
//     const hashedPassword = await bcryptjs.hash(password,8)

//     console.log(hashedPassword)

//     const compare = await bcryptjs.compare('r123456',hashedPassword)
//     console.log(compare)
// }
// passwordFunction()

///////////////////////////////////////////////////////////////////////////

// jwt --> user authorized / allowed to make requested operation or not

// const jwt = require('jsonwebtoken')
// const myToken = () =>{
//     // create token
//     // [header].[payload].[secretkey]
//     // header --> information token and hashing algo
//     // payload --> user info
//     // secretkey 
//     const token = jwt.sign({_id:'123'},'nodecourse')
//     console.log(token)

//     // verify
//     // iat --> issuedAt
//     const tokenVerify = jwt.verify(token,'nodecourse')
//     console.log(tokenVerify)
// }

// myToken()

//////////////////////////////////////////////////////////////////////////

// request --> run http handler
               // middelware
// request --> do sth(check token) --> run http hanlder

///////////////////////////////////////////////////////////////////////////////

// const main = async() =>{
//     // const task = await Task.findById('628c8989781c18f8dcf4ee16')
//     // await task.populate('owner') // ref:'User'
//     // console.log(task.owner)

//     const user = await User.findById('628b4096bbb2d27d9044434d')
//     await user.populate('tasks')
//     console.log(user.tasks)

// }
// main()

////////////////////////////////////////////////////////////////////////

// const multer = require('multer')
// const uploads = multer({
//     dest:'images',
//     fileFilter(req,file,cb){
//         if(!file.originalname.endsWith('.pdf')){
//             cb(new Error('Please upload pdf file'))
//         }
//         cb(null,true)
//     }
// })

// app.post('/image',uploads.single('avatar'),(req,res)=>{
//     res.send('Uploaded Successfully')
// })

app.listen(port,()=>{console.log('Server is running on port ' + port)})