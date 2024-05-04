import mongoose, { Document, Schema } from 'mongoose';

 export interface LoginDetailsDocument extends Document {
    userId:String,
    time:String,
    date:String,
    browser:String,
    platform:String,
}

const LoginDetailsSchema = new Schema<LoginDetailsDocument>({
    userId:{type:String,required:true},
    time:String,
    date:String,
    browser:String,
    platform:String
});

const LoginDetails = mongoose.model<LoginDetailsDocument>('LoginDetails', LoginDetailsSchema);

export default LoginDetails;
