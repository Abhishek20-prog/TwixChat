import moongose from 'mongoose';
const connectionSchema = new moongose.Schema({
    from_user_Id: {type:string , ref: "User" , required: true},
    to_user_Id: {type:string , ref: "User", required: true},
    status: {type:String, enum: ['pending', 'accepted', 'rejected'], default: 'pending'}
},{timestamps: true});
const connectionModel = moongose.model('Connection', connectionSchema);
export default connectionModel;