import transformationUtils from "@imagekit/nodejs/lib/transformation-utils.js";
import imagekit from "../config/imagekit";
import User from "../models/user";

export const getUser= async (res,req) => {
    try {
        const{userID}=req.auth()
    const user = await User.findById(userID)
    if(!user){
        return res.json({success:false , message:"user Not Found"})
    }

    } catch (error) {
        console.log(error)
         return res.json({success:false , message:error.message})

        
    }
    
    
}
export const updateUser= async (res,req) => {
    try {
        const{userID}=req.auth()
        const {username , bio , location , full_name}=req.body;
    const tempuser = await User.findById(userID)
    !username && (username=tempuser.username)
    if(tempuser.username !== username){
        const user = User.findOne({username})
        if(user)
        {
            username=tempuser.username
        }

    }
    const updatedData={
        username,
        bio,
        full_name,
        location
    }
    const profile = req.files.profile && req.files.profile [0]
    const cover = req.files.cover && req.files.cover [0]
    if (cover) {
    const buffer = fs.readFileSync(cover.path)

    const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
    })
    const url = imagekit.url({
        path:response.filepath,
        transformation:[
            {quality:'auto'},
            {format:'webp'},
            {width:'1280'}

        ]
    })
    updatedData.cover_photo = url;
}
if (profile) {
    const buffer = fs.readFileSync(profile.path)

    const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
    })
    const url = imagekit.url({
        path:response.filepath,
        transformation:[
            {quality:'auto'},
            {format:'webp'},
            {width:'512'}

        ]
    })
    updatedData.profile_picture = url;
}
const user = await User.findByIdAndUpdate(userID , updatedData ,{new:true})
res.json({success:true , user , message:"profile created successfully"})
    

    } catch (error) {
        console.log(error)
         return res.json({success:false , message:error.message})

        
    }
    
    
}