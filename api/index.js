import express, { json } from 'express'
import usersRouter from './users.js';
import bookRouter from './book.js';
import userRouter from './user.js';
import cors from 'cors'
const server = express();
server.use(cors())
server.use(json())
server.use("/api",bookRouter)
server.use("/api",usersRouter)
server.use("/api",userRouter)

export default server