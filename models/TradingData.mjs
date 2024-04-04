import mongoose from "mongoose";

// Định nghĩa Schema
const tradingDataSchema = new mongoose.Schema({
	date: { type: Date, required: true },
	open: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
	close: { type: Number, required: true },
	volume: { type: Number, required: true },
	sma7: { type: Number },
	sma25: { type: Number },
	sma99: { type: Number },
});

// Tạo model từ schema
const TradingData = mongoose.model("TradingData", tradingDataSchema);

export default TradingData;
