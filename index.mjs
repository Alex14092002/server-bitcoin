// server.js

import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import tradingDataRoutes from "./routes/tradingDateRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import bodyParser from "body-parser";
import cors from "cors"; // Import thư viện cors

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Sử dụng cors middleware ở đây
const server = http.createServer(app);
const io = new Server(server);

// Kết nối MongoDB
mongoose
	.connect(
		"mongodb+srv://cn8262692:XgGhrMyDvl60hzpW@cluster0.u4nbaab.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("MongoDB connection error:", error);
	});

// Sử dụng API routes
app.use("/api/tradingdata", tradingDataRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
