import express from 'express'
import prisma from './lib/prismaClient.js'
import  jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const SEKRET_KEY = process.env.SEKRET_KEY;
const router = express.Router()

//? singUp
router.post('/signup',async (req,res)=>{
    const { name ,email,password} = req.body
    try{
        const existingUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        // ! if user exist 
        if(existingUser){
            return res.json({massege:"User Exist"})
        }
    
        //* else hash the password
        const hashedPassword = await bcrypt.hash(password,10)
    
        const newUser = await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword
            }
        })
    
        if(newUser){
            return res.status(201).json({massege:"user succefull created",newUser})
        }
        res.json({massege:"User not created!",status:400})
    }catch (error){
        res.json({error})
    }
})

// ? logIn
router.post('/login',async(req,res)=>{
    const { email,password} = req.body

    try{

        const existingUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })

        if(!existingUser){
            return res.status(404).json({massege:"user not found"})
        }

        // * checking password
        
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)

        if(!isPasswordCorrect){
            return res.status(400).json({massege:"invalid user"})
        }

        // * create token

        const token = jwt.sign(
            {id:existingUser.id,email:existingUser.email},
            SEKRET_KEY,
            {expiresIn:"1d"}
        )

        return res.status(200).json({massege:"logIn successfull",token})
    }catch (error){
        res.status(500).json({massege:"some thing went wrong",error})
    }
})
export default router