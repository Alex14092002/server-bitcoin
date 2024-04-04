// controllers/userController.js

import bcrypt from "bcrypt";
import User from "../models/User.mjs";

// Tạo một người dùng mới
export const createUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Băm mật khẩu trước khi lưu vào cơ sở dữ liệu
		const hashedPassword = await bcrypt.hash(password, 10);

		// Tạo một người dùng mới với thông tin cần thiết
		const user = new User({ email, password: hashedPassword });

		// Lưu người dùng vào cơ sở dữ liệu
		const newUser = await user.save();

		// Trả về người dùng mới đã được tạo
		res.status(201).json(newUser);
	} catch (error) {
		// Xử lý lỗi nếu có
		console.log(error.message);
		res.status(400).json({ message: error.message });
	}
};

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
	const { id } = req.params;
	const { email, balance } = req.body;

	try {
		// Kiểm tra xem người dùng có tồn tại không
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Cập nhật thông tin người dùng

		user.email = email;
		user.balance = balance;

		// Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
		const updatedUser = await user.save();

		// Trả về thông tin của người dùng đã cập nhật
		res.status(200).json(updatedUser);
	} catch (error) {
		// Xử lý lỗi nếu có
		res.status(500).json({ message: error.message });
	}
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		// Xóa người dùng khỏi cơ sở dữ liệu dựa trên ID
		await User.findByIdAndRemove(id);

		// Trả về thông báo thành công
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		// Xử lý lỗi nếu có
		res.status(500).json({ message: error.message });
	}
};

export const getUserById = async (req, res) => {
	const { id } = req.params;

	try {
		// Tìm người dùng trong cơ sở dữ liệu dựa trên ID
		const user = await User.findById(id);

		// Kiểm tra xem người dùng có tồn tại không
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Trả về thông tin của người dùng
		res.status(200).json(user);
	} catch (error) {
		// Xử lý lỗi nếu có
		res.status(500).json({ message: error.message });
	}
};

// Lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
	try {
		// Lấy tất cả người dùng từ cơ sở dữ liệu
		const users = await User.find();

		// Trả về danh sách người dùng
		res.status(200).json(users);
	} catch (error) {
		// Xử lý lỗi nếu có
		res.status(500).json({ message: error.message });
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Tìm người dùng trong cơ sở dữ liệu bằng email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// So sánh mật khẩu đã băm với mật khẩu nhập vào
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Trả về thông tin của người dùng đã đăng nhập thành công
		res.status(200).json({ user });
	} catch (error) {
		// Xử lý lỗi nếu có
		res.status(500).json({ message: error.message });
	}
};

// Cộng balance cho tài khoản theo ID
export const addBalanceById = async (req, res) => {
	const { id } = req.params;
	const { amount } = req.body;

	try {
		// Tìm người dùng trong cơ sở dữ liệu bằng ID
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Cộng số dư cho người dùng
		user.balance += amount;

		// Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
		const updatedUser = await user.save();

		// Trả về thông tin của người dùng đã cập nhật
		res.status(200).json(updatedUser);
	} catch (error) {
		// Xử lý lỗi nếu có
		res.status(500).json({ message: error.message });
	}
};

// Thêm giao dịch mua/bán coin với kiểm tra số dư và tài sản
export const addTransaction = async (req, res) => {
	const { userId, coinName, quantity, amount, isPurchase } = req.body;

	try {
		// Tìm người dùng trong cơ sở dữ liệu bằng ID
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (isPurchase) {
			// Nếu là mua, kiểm tra số dư của người dùng
			if (user.balance < amount) {
				return res.status(400).json({ message: "Insufficient balance" });
			}
			// Trừ số dư của người dùng
			user.balance -= amount;
		} else {
			// Nếu là bán, kiểm tra xem người dùng có coin đó không và số lượng có đủ để bán không
			const asset = user.assets.find((asset) => asset.coinName === coinName);
			if (!asset || asset.quantity < quantity) {
				return res.status(400).json({ message: "Insufficient asset quantity" });
			}
			// Cập nhật số lượng coin sau khi bán
			asset.quantity -= quantity;
			// Cộng tiền bán vào số dư của người dùng
			user.balance += amount;
		}

		// Tạo giao dịch mới
		const transaction = {
			amount,
			date: new Date(),
			type: isPurchase,
			describe: isPurchase
				? `Mua ${quantity} ${coinName}`
				: `Bán ${quantity} ${coinName}`,
		};

		console.log(transaction);
		// Thêm giao dịch vào lịch sử giao dịch của người dùng
		user.transactionHistory.push(transaction);

		// Nếu là mua và người dùng chưa sở hữu coin, thêm vào tài sản
		if (isPurchase) {
			let asset = user.assets.find((asset) => asset.coinName === coinName);
			if (asset) {
				asset.quantity += quantity;
			} else {
				user.assets.push({ coinName, quantity });
			}
		}

		// Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
		const updatedUser = await user.save();

		// Trả về thông tin của người dùng đã cập nhật
		res.status(200).json(updatedUser);
	} catch (error) {
		// Xử lý lỗi nếu có
		res.status(500).json({ message: error.message });
	}
};
