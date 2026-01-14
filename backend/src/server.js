import express from "express";
import path from "path";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Middleware
 
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// app.use(cookieParser());
app.use(express.json({ limit: "5mb" })); // for req.body

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


// Production Setup

if (process.env.NODE_ENV === "production") {
  // Serve frontend static files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch-all for React Router (IMPORTANT)
  app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend", "dist", "index.html")
  );
});

}


// Server Start
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // connectDB();
});
