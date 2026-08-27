import cors from 'cors'
import express from 'express'
import 'dotenv/config'
import connectMongoDB from './config/db.js';
import {inngest,functions} from './inngest/index.js'
import { serve } from 'inngest/express';
import { clerkMiddleware } from '@clerk/express'
const app = express();
await connectMongoDB()

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.get("/", (req, res) => {
  res.send(
     "TwixChat server is running 🚀"
  );
});
app.use("/api/inngest", serve({client:inngest,functions}))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});