
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});

const fileFilter = (req, file, callback) => {
    const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    ];

    const allowedVideoTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif",
        ".mp4",
        ".webm",
        ".mov",
    ];

    if (
        !allowedExtensions.includes(extension) ||
        ![...allowedImageTypes, ...allowedVideoTypes].includes(file.mimetype)
    ) {
        return callback(
            new Error("Unsupported file type. Upload an image or video.")
        );
    }

    callback(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
    fileSize: 100 * 1024 * 1024,
    files: 5,
},
});