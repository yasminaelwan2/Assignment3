
const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userScehma = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true, 
        unique:true,
        trim:true,
        validate(value){
            let emailReg= new RegExp('^[a-z0-9._%+-]+@[gmail|hotmail]+.[a-z]{2,4}$')
            if(!validator.isEmail(value) || !emailReg.test(value)){
                throw new Error ('Please enter valid email')
             }
        }

    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true,
        validate(value){
        let passwordReg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
        if(!passwordReg.test(value)){
            throw new Error('Password must include uppercase,lowercase,special chracter and numbers')
        }
        }
    },
    phonenumber:{
        type:Number,
        required:true,
        validate(value){
            let phoneReg =new RegExp('^(\+201|01|00201)[0-2,5]{1}[0-9]{8}')
            if(!phoneReg.test(value)){
                throw new Error ('Please enter valid phone number')
             }
        }
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }
})

////////////////////////////////////////////////////////////////////////////
userScehma.pre('save',async function(){
    const reporter = this
    if(reporter.isModified('password'))
    reporter.password = await bcryptjs.hash(reporter.password,8)
})


//////////////////////////////////////////////////////////////////
// login
userScehma.statics.findByCredentials = async (email,password) =>{
    const reporter= await Reporter.findOne({email})
    console.log(reporter)
    if(!reporter){
        throw new Error ('Unable to login please check email or password')
    }
    const isMatch = await bcryptjs.compare(password,reporter.password)
    if(!isMatch){
        throw new Error ('Unable to login please check email or password')
    }

    return reporter
}

///////////////////////////////////////////////////////////////////
userScehma.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'nodecourse')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token 
}
///////////////////////////////////////////////////////////////////////
// hide sensitve data
userScehma.methods.toJSON = function(){
    const reporter = this
    const reporterObject = reporter.toObject()

    delete reporterObject.password
    delete reporterObject.tokens

    return reporterObject
}
// virtual relation

userScehma.virtual('news',{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})

const Reporter = mongoose.model('Report',userScehma)
module.exports = Reporter