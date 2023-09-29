import express from 'express'
import prisma from './lib/prismaClient.js'
import authenticate from './middleware/authenticate.js'

const router = express.Router()

router.get('/books',async(req,res)=>{
    const allBooks = await prisma.book.findMany()
    if(allBooks.length == 0){
        return res.status(404).json({massege:"There is no book in the db"})
    }
    res.status(201).json(allBooks)
})

router.post('/books',authenticate,async(req,res)=>{
    const {name,imgUrl,auther} = req.body
    const {id} = req.decoded

    try{

        const newbook = await prisma.book.create({
            data:{
                name,
                auther,
                imgUrl,
                price,
                userId:id,
            }
        })
        
        if(!newbook){
            return res.status(401).json({massege:"Book not created"})
        }

        res.status(201).json({massege:"Book created successfull",newbook})

    }catch(error){
        res.status(500).json({massege:"some thing went wrong",error})
    }
})

export default router