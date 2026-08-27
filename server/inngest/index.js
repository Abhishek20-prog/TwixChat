import { Inngest } from "inngest";
import User from '../models/user.js'

// Create a client to send and receive events
export const inngest = new Inngest({ id: "TwixChat-app" });
const syncUsercreation = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event:'clerk/user.created'},
    async ({event}) => {
        const{id , first_name , last_name , email_addresses , image_url}=event.data
        let username= email_addresses[0].email_address.split('@')[0]
        const user = await User.findOne({username})
        if (user) {
            username = username + Math.floor(Math.random()*10000)
            
        }
        const userData = {
            _id: id,
            full_name: first_name + " " + last_name,
            username,
            email:email_addresses[0].email_address,
            profile_picture:image_url
        }
        await User.create(userData)

        
    }
)
const syncUserupdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event:'clerk/user.updated'},
    async ({event}) => {
        const{id , first_name , last_name , email_addresses , image_url}=event.data
      
        const updateduserData = {
            
            full_name: first_name + " " + last_name,
            
            email:email_addresses[0].email_address,
            profile_picture:image_url
        }
        await User.findByIDAndUpdate(id, updateduserData)

        
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUsercreation,
    syncUserupdation
];