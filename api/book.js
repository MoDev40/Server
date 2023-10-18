import express, { json } from 'express'
import prisma from './lib/prismaClient.js'
import authenticate from './middleware/authenticate.js'

const router = express.Router()

router.get('/books',async(req,res)=>{
    try{
        const allBooks = await prisma.book.findMany()
        if(allBooks.length == 0){
            return res.status(404).json({massege:"There is no book in the db"})
        }
        res.status(201).json(allBooks)
    }catch(error){
        res.json({error})
    }
})

router.post('/books/add',authenticate,async(req,res)=>{
    const {name,imgUrl,price} = req.body
    const {id} = req.decoded
    try{
        const newbook = await prisma.book.create({
            data:{
                name,
                price,
                imgUrl,
                userId:id
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

router.put("/books/edit/:id",authenticate,async(req,res)=>{
    const {id} = req.params
    const {name,imgUrl,price} = req.body
    try{
        const updatedBook = await prisma.book.update({
            where:{
                id:Number(id),
            },
            data:{
                name,imgUrl,price
            }
        })
        if(!updatedBook){
            res.status(401).json("Book is't updated")
        }
        res.status(201).json({massege:"Book updated success",updatedBook})
    }catch(error){
        res.status(500).json({error})
    }
})

router.delete("/books/delete/:dId",authenticate,async(req,res)=>{
    const { deletedId } = req.params
    const {id} = req.decoded    
    const deletedBook = await prisma.book.delete({
        where:{
            id:Number(deletedId),
            userId:Number(id)
        }
    })
    if(!deletedBook){
        return res.status(401).json({massege:"Book not deleted"})
    }
    res.status(201).json({massege:"Book deleted successfull Book Id: ",deletedId})
})

export default router