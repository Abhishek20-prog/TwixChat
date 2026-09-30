import "dotenv/config";

import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import connectMongoDB from "./config/db.js";
import { inngest, functions } from "./inngest/index.js";
import { userRouter } from "./routes/userRoutes.js";

const app = express();

/* ----------------------------------
   Database Connection
---------------------------------- */

await connectMongoDB();

/* ----------------------------------
   Global Middleware
---------------------------------- */

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ----------------------------------
   Clerk Authentication
---------------------------------- */

app.use(clerkMiddleware());

/* ----------------------------------
   Health Check
---------------------------------- */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TwixChat server is running 🚀",
    });
});

/* ----------------------------------
   Inngest
---------------------------------- */

app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions,
    })
);

/* ----------------------------------
   API Routes
---------------------------------- */

app.use("/api/user", userRouter);
app.use("/api/post", (await import("./routes/postroutes.js")).default);

/* ----------------------------------
   404 Handler
---------------------------------- */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

/* ----------------------------------
   Global Error Handler
---------------------------------- */

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : err.message,
    });
});

/* ----------------------------------
   Local Development
---------------------------------- */

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`TwixChat server running on port ${PORT}`);
    });
}

/* ----------------------------------
   Vercel
---------------------------------- */

export default app;