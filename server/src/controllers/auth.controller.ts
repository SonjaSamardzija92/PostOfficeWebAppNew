import { Request, Response } from 'express';
import { User } from '../models/commonModels';
import bcrypt from "bcryptjs";

export class AuthController {

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Compare the passwords
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      // Generate a token (use JWT for example)
      const token = "fake-jwt-token"; // Replace with actual JWT logic

      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to login" });
    }
  };

  public async registration(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
      }

      // Create a new user
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to registration" });
    }
  };
}