import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import httpStatus  from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import test from "node:test";
const app : Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

 
app.get("/", (req, res)=>{
    res.send("hello, world!");
})


app.post("/api/users/register", async (req:Request, res: Response)=>{

 const {name, email,password, } = req.body;
 
 const isUserExist =await prisma.user.findUnique({
    where : {email}
 })

 if(isUserExist){
    throw new Error("user with this email already exists")
 }

 const hashedPassword = await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))


 const createdUser= await prisma.user.create({
    data: {
        name,
        email,
        password:hashedPassword,

    }
 });


 await prisma.profile.create({
    data: {
       userId :createdUser.id,
    }
 });


 const user = await prisma.user.findUnique({
    where:{
        id :createdUser.id,
        email:createdUser.email || email
    },
  

 })



  res.status(httpStatus.CREATED).json({
    success: true ,
    statusCode : httpStatus.CREATED,
    massage : "User registered done",
    data : {
        user
    }

});

})

 export default app