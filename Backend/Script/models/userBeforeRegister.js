import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;
import { policeSchema } from './User.js';


const UserBeforeRegisterSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        // match: [
        //     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        //     'Please enter a valid email address'
        // ]

    },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
     phoneNumber:{
        type:String,
        required:true
    },
     userType:{
        type:String,
        required:true,
        default:"citizen"
    },
    password: {
        type: String,
        required: true
    },
     policeData: {
          type: policeSchema,
          required: function () {
            return this.userType === "police";
          },
        },
    validateToken:{
        type:String,
        required:true
    },
    tokenTime:{
        type:Date,
        required:true
    }
},{timestamps:true});

const UserBeforeRegister = models?.UserBeforeRegister || model("UserBeforeRegister", UserBeforeRegisterSchema);

export default UserBeforeRegister;