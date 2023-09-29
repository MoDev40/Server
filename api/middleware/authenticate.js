import jwt from 'jsonwebtoken'
import 'dotenv/config'

const SEKRET_KEY = process.env.SEKRET_KEY;

function authenticate (req,res,next){
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({massege:"Authentication failed "})
    }

    const tokenWithoutBearer = token.split(" ")[1];

    jwt.verify(tokenWithoutBearer,SEKRET_KEY ,(error,decoded)=>{
        if(error){
            return res.status(401).json({massege:"invalid token "})
        }   

        req.decoded = decoded
        next()
    })
}

export default authenticate