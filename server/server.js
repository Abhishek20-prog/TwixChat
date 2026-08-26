import cors from 'cors'
import express from 'express'
import 'dotenv/config'
import connectMongoDB from './config/db.js';

const app = express();
await connectMongoDB()

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
     "TwixChat server is running 🚀"
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});