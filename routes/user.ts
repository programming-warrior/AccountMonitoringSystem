import { Router, Request, Response } from 'express';
import jwt from "jsonwebtoken";


const routes = Router();

import User,{UserDocument} from '../models/UserModel';
import LoginDetails,{LoginDetailsDocument} from '../models/LoginDetailsModel';



routes.get('/fetch/:id',async(req:Request,res:Response)=>{
    const data=await LoginDetails.find({userId:req.params.id});
    return res.status(200).json(data).end();
})


routes.post('/register',async(req: Request, res: Response) => {
    let email: string|null|undefined = req.body.email;
    let password: string|null|undefined= req.body.password;

    email= email && typeof(email)=='string' && email.trim().length>0 ?email:null;
    password=password && typeof(password)=='string' && password.trim().length>0 ? password: null;
    if(!email || !password) return res.status(401).json({message:"invalid request"}).end();

    try{
        const userFound=await User.findOne({email}).exec();
        if(userFound) return res.status(401).json({message:"user already exists"}).end();

        const user=await User.create({email,password});

        const secretKey:string = process.env.SECRET_KEY || '';

        let index=req.rawHeaders.findIndex(val=> /sec-ch-ua-platform/i.test(val));
        const platform=req.rawHeaders[index+1];
        index=req.rawHeaders.findIndex(val=>/sec-ch-ua/i.test(val));
        const browser=req.rawHeaders[index+1].split(',')[1].split(';')[0];

        const timeStamp=new Date();
        const time=timeStamp.getHours()+"hrs "+timeStamp.getMinutes()+"mins";
        const date=timeStamp.getFullYear()+"-"+timeStamp.getMonth()+"-"+timeStamp.getDay();

        //store the login details into the database
        const savedInfo=await LoginDetails.create({userId:user._id.toString(),browser,platform,time,date});
        const loginId=savedInfo._id;

        const token=jwt.sign({
            userId:user._id.toString(),
            loginId:loginId.toString(),
            loginDetails:{
                time,
                date,
                platform,
                browser
            }
        },secretKey);

        return res.status(201).json({message:{token,loginId:loginId.toString(),userId:user._id.toString()}}).end();
    }
    catch(e){
        console.log(e)
        res.status(500).json({message:"something went wrong"}).end();
        return;
    }

    
})

routes.post('/login', async(req: Request, res: Response) => {
    let email: string|null|undefined = req.body.email;
    let password: string|null|undefined= req.body.password;

    email= email && typeof(email)=='string' && email.trim().length>0 ?email:null;
    password=password && typeof(password)=='string' && password.trim().length>0 ? password: null;
    if(!email || !password) return res.status(401).json({message:"invalid request"}).end();

    try{
        const user=await User.findOne({email}).exec();
        if(!user) return res.status(401).json({message:"user not found"}).end();
        if(user.password!=password) return res.status(401).json({message:"wrong password"}).end();

        const secretKey:string = process.env.SECRET_KEY || '';

        let index=req.rawHeaders.findIndex(val=> /sec-ch-ua-platform/i.test(val));
        const platform=req.rawHeaders[index+1];
        index=req.rawHeaders.findIndex(val=>/sec-ch-ua/i.test(val));
        const browser=req.rawHeaders[index+1].split(',')[1].split(';')[0];

        const timeStamp=new Date();
        const time=timeStamp.getHours()+"hrs "+timeStamp.getMinutes()+"mins";
        const date=timeStamp.getFullYear()+"-"+timeStamp.getMonth()+"-"+timeStamp.getDay();

        //store the login details into the database
        const savedInfo=await LoginDetails.create({userId:user._id.toString(),browser,platform,time,date});
        const loginId=savedInfo._id;

        const token=jwt.sign({
            userId:user._id.toString(),
            loginId:loginId.toString(),
            loginDetails:{
                time,
                date,
                platform,
                browser
            }
        },secretKey);

        return res.status(201).json({message:{token,loginId:loginId.toString(),userId:user._id.toString()}}).end();
    }
    catch(e){
        console.log(e)
        res.status(500).json({message:"something went wrong"}).end();
        return;
    }

    
});

export default routes;
