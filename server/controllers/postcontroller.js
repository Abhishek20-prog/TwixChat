//add post
async function addPost(req, res) {
    try {
        const { content, post_type } = req.body;
        const userId = req.user._id;
        let image_url = null;
        if (post_type === "image" || post_type === "image+text") {
            image_url = req.file ? req.file.path : null;
        }
        const newPost = new Post({
            userId,
            content,
            image_url,
            post_type
        });
        await newPost.save();
        res.status(201).json(newPost);
    } 
    

    catch (error) {
        res.status(500).json({ message: error.message });
    }
}