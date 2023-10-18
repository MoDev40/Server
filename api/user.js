import express from 'express';
import authenticate from './middleware/authenticate.js';
import prisma from './lib/prismaClient.js';

const router = express.Router()

router.get('/users/user',authenticate,async(req,res)=>{
    const {email} = req.decoded
    try{
        if(!email){
            res.status(500).json("Token missing")
        }
        const user = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(!user){
            res.status(401).json("An uthorized")
        }
        res.status(201).json(user)
    }catch(error){
        res.json({error})
    }
})

export default router