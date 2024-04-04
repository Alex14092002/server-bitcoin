import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
	amount: Number,
	date: { type: Date, default: Date.now },
	type: {
		type: Boolean,
	},
	describe: String,
});
const assetSchema = new mongoose.Schema({
	coinName: String, // Tên của coin
	quantity: Number, // Số lượng coin sở hữu
});

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	balance: { type: Number, default: 0 },
	transactionHistory: [transactionSchema],
	assets: [assetSchema],
});

const User = mongoose.model("User", userSchema);

export default User;
