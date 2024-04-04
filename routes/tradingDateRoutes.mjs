import express from "express";
import {
	addTradingData,
	getAllTradingData,
} from "../controllers/tradingDataController.mjs"; // Đảm bảo đường dẫn đúng

const router = express.Router();

// Route thêm dữ liệu trading

router.get("/", getAllTradingData);
router.post("/create", addTradingData);

export default router;
