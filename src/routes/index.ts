// src/routes/index.ts
import express from "express";
import authRoutes from "./auth.route";
import productRoutes from "./product.route"; 
import uploadRoutes from "./upload.routes"; // Import the upload routes
const apiRouter = express.Router();

// ✅ Mount individual route modules

apiRouter.use("/auth", authRoutes);
apiRouter.use("/product", productRoutes);
apiRouter.use("/upload", uploadRoutes); // Serve static files from the uploads directory

export default apiRouter;
