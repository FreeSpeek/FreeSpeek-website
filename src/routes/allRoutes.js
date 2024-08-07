// src/routes/allRoutes.js
import express from "express";
import authRoutes from "./authRoutes.js";
import postRoutes from "./postRoutes.js";
import neighborhoodRoutes from "./neighborhoodRoutes.js";
import commentRoutes from "./commentRoutes.js";
import listingRoutes from "./listingRoutes.js";
import connectionRequestRouter from "./connectionRequestRoutes.js";

const allRoutes = express.Router();

allRoutes.use("/auth", authRoutes);
allRoutes.use("/posts", postRoutes);
allRoutes.use("/neighborhoods", neighborhoodRoutes);
allRoutes.use("/comments", commentRoutes);
allRoutes.use("/listings", listingRoutes);
allRoutes.use("/connections", connectionRequestRouter);

export default allRoutes;
