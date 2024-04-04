import express from "express";
import {
	createUser,
	getUserById,
	updateUser,
	deleteUser,
	getAllUsers,
	loginUser,
	addTransaction,
	addBalanceById,
} from "../controllers/userController.mjs";

const router = express.Router();

// Định nghĩa các tuyến đường cho người dùng
router.get("/", getAllUsers);
router.post("/create", createUser); // Tạo người dùng mới
router.get("/:id", getUserById); // Lấy thông tin người dùng theo ID
router.put("/update/:id", updateUser); // Cập nhật thông tin người dùng
router.delete("/delete/:id", deleteUser); // Xóa người dùng
router.post("/login", loginUser);
router.post("/addtransaction", addTransaction);
router.post("/addbalance/:id", addBalanceById);
export default router;
