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
    

    } catch (error) {
        console.log(error)
         return res.json({success:false , message:error.message})

        
    }
    
    
}