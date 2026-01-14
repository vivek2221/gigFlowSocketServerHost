import express from "express";
import cors from 'cors'
import gigs from './endPoints/gigs.js'
import bids from './endPoints/bids.js'
import otp from './endPoints/otp.js'
import {auth} from './middlewares/authIn.js'
import Auth from './endPoints/auth.js'
import cookieParser from "cookie-parser";
import { ModelMessages, ModelSid } from "./mongoose/mongooseValidationPlusModelCreation.js";
const server=express()
const PORT = process.env.PORT || 10000;
server.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
server.use(express.json())
server.use(cookieParser(process.env.SECRET))
server.use('/api/auth',Auth)
server.use('/api/otp',otp)
server.use('/api/gigs',auth,gigs)
server.use('/api/bids',auth,bids)
server.get('/api/messages',auth,async(req,res)=>{
    const {sid}=req.signedCookies 
    const id=await ModelSid.findOne({_id:sid})
    const data=await ModelMessages.find({to:id.someId})
    res.status(200).json(data)
})
server.listen(PORT,'0.0.0.0',()=>{
    console.log(`server started on port ${PORT}`)
})