import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
   content: {
      type: String,
      required: true
   },
   image_url: 
     [{type: String}],
      default: null
      ,
    post_type: {
        type: String,
        enum: ["text", "image", "video","image+text","video+text"],
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    

}],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
},
{
    timestamps: true
}
);
export const Post = mongoose.model("Post", postSchema);