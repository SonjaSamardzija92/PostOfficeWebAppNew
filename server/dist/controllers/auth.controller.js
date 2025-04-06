"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const commonModels_1 = require("../models/commonModels");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthController {
    async login(req, res) {
        const { email, password } = req.body;
        try {
            // Check if user exists
            const user = await commonModels_1.User.findOne({ where: { email } });
            if (!user) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            // Compare the passwords
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            // Generate a token (use JWT for example)
            const token = "fake-jwt-token"; // Replace with actual JWT logic
            res.status(200).json({ message: "Login successful", token });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to login" });
        }
    }
    ;
    async registration(req, res) {
        try {
            const { email } = req.body;
            // Check if the user already exists
            const existingUser = await commonModels_1.User.findOne({ where: { email } });
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
            }
            // Create a new user
            const user = await commonModels_1.User.create(req.body);
            res.status(201).json(user);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to registration" });
        }
    }
    ;
}
exports.AuthController = AuthController;
