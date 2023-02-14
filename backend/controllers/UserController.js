import User from "../models/User.js";
import bycript from "bcrypt";
import jwt from "jsonwebtoken";
import { json } from "sequelize";

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await User.findAll();
      return res.json({
        message: "Get Data User Successfully",
        users,
      });
    } catch (error) {
      console.error(error);
    }
  }

  static async register(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // validasi
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing data for registration!",
      });
    }

    // cek password
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password Dont Match!",
      });
    }

    // hash password
    const salt = await bycript.genSalt();
    const hashPassword = await bycript.hash(password, salt);

    try {
      // insert
      User.create({
        name,
        email,
        password: hashPassword,
      });

      res.status(200).json({
        message: "Register Successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Register Failed",
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    // validasi
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing data for login!",
      });
    }

    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        res.status(400).json({
          message: "Invalid Login Credentials",
        });
      }

      const match = await bycript.compare(password, user.password);

      if (!match) {
        res.status(400).json({
          message: "Invalid Login Credentials",
        });
      }

      // ambil masing masing data
      const userId = user.id;
      const userName = user.name;
      const userEmail = user.email;
      const accessToken = jwt.sign(
        {
          userId,
          userName,
          userEmail,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "20s",
        }
      );

      const refreshToken = jwt.sign(
        {
          userId,
          userName,
          userEmail,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // update refresh token user di db
      await User.update(
        {
          refresh_token: refreshToken,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      // membuat http only cookie (kalau https tambahkan opsi "secure: true")
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login Successfully",
        accessToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Login Failed",
      });
    }
  }
}

export default UserController;
