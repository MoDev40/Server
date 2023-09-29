import express, { json } from 'express'
import userRouter from './users.js';
import bookRouter from './book.js';
const server = express();
server.use(json())

server.use("/api",bookRouter)
server.use("/api",userRouter)

export default server