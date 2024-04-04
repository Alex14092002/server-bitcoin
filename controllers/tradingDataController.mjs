// controllers/tradingDataController.js
import TradingData from "../models/TradingData.mjs"; // Đảm bảo đường dẫn đến model đúng

// Hàm thêm dữ liệu trading
export const addTradingData = async (req, res) => {
	try {
		const { date, open, high, low, close, volume, sma7, sma25, sma99, idx } =
			req.body;

		const newTradingData = new TradingData({
			date,
			open,
			high,
			low,
			close,
			volume,
			sma7,
			sma25,
			sma99,
		});

		await newTradingData.save();

		res.status(201).json(newTradingData);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getAllTradingData = async (req, res) => {
	try {
		const tradingData = await TradingData.find({});
		res.status(200).json(tradingData);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
