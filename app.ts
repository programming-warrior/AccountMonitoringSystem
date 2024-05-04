import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
require("./controllers/connection");
import expressWs from 'express-ws';


const app = express();
const {app:wsApp, getWss}=expressWs(app);
import userRoutes from './routes/user';
import verifyTokenSocket from './controllers/token';
import LoginDetails from './models/LoginDetailsModel';

const PORT: number = parseInt(process.env.PORT || '8000', 10); 

app.use(cors({
    origin:'*'
}))
app.use(express.json());
app.use('/api/v1',userRoutes);


const loginPools: { [key: string]: {[key:string]:any} } = {};



wsApp.ws('/',verifyTokenSocket,(con,request)=>{
    if(request.userId && !loginPools.hasOwnProperty(request.userId)) loginPools[request.userId]={};

    if(request.userId && request.loginId && request.loginDetails && loginPools[request.userId]){

        loginPools[request.userId][request.loginId]={con};

        console.log(Object.keys(loginPools[request.userId]));

        for(let key in loginPools[request.userId]){
            if(key!=request.loginId){
                let socketCon=loginPools[request.userId][key]['con'];
                const data={
                    "event":"new-login",
                    "message":{
                        userId:request.userId,
                        loginId:request.loginId,
                        loginDetails:request.loginDetails
                    }
                }
                socketCon.send(JSON.stringify(data));
            }
        }

        con.addEventListener('message',async(data)=>{
            if(request.userId){
                const socketQuery:string=data.data.toString();
                const {event,message}=JSON.parse(socketQuery);
                if(event==='sign-out'){
                    const {loginId}=message;
                    //delete the login details from the database
                    const res=await LoginDetails.deleteOne({_id:loginId});
                    const loggedOffDeviceCon=loginPools[request.userId][loginId]['con'];
                    loggedOffDeviceCon.send(JSON.stringify({event:'log-yourself-out',message:{}}));

                    //delete the con from the loginPools
                    delete loginPools[request.userId][loginId];

                    //broadcast this to all the devices
                    for(let key in loginPools[request.userId]){
                        loginPools[request.userId][key]['con'].send(JSON.stringify({event:'log-device-out',message:{loginId}}))
                    }
                }
            }
          
        })
           

    }

})

app.listen(PORT, () => {
    console.log(`APP IS LISTENING ON PORT ${PORT}`);
});
