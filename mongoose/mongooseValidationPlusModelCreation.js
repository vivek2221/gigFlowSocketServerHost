import mongoose  from "mongoose";
import 'dotenv/config'
await mongoose.connect(process.env.mongooseConnectionString)

const loginSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:String,
    password:String
}) 
const sidSchema= new mongoose.Schema({
    name:String,
    someId:mongoose.Schema.ObjectId,
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*60*10
    }
})
const messagesSchema=new mongoose.Schema({
     message:String,
     to:mongoose.Schema.Types.ObjectId
})
const otpSchema=new mongoose.Schema({
    email:String,
    otp:Number,
    timeAt:{
        type:Date,
        default:Date.now,
        expires:60*5
    }
})
const gigSchema=new mongoose.Schema({
    title:String,
    description:String,
    budget:Number,
    ownerId:mongoose.Schema.Types.ObjectId,
    status:String
})
const bidSchema=new mongoose.Schema({
    gigId:mongoose.Schema.Types.ObjectId,
    title:String,
    freelancerId:mongoose.Schema.Types.ObjectId,
    message:String,
    status:String,
    price:Number
})
const ModelLogin= mongoose.model('login',loginSchema)
const ModelSid=mongoose.model('sid',sidSchema)
const ModelOtp=mongoose.model('otp',otpSchema)
const ModelGig=mongoose.model('gig',gigSchema)
const ModelBid=mongoose.model('bid',bidSchema)
const ModelMessages=mongoose.model('messages',messagesSchema)

export {
    ModelLogin,
    ModelSid,
    ModelOtp,
    ModelGig,
    ModelBid,
    ModelMessages
}
process.on('SIGINT',async()=>{
   await  mongoose.disconnect()
    process.exit(0)
})