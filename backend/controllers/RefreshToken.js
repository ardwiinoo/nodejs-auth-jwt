import jwt from "jsonwebtoken";
import User from "../models/User.js";

class RefreshToken {
  static async refresh(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) return res.sendStatus(401); // unauthorized

      const user = await User.findOne({
        where: {
          refresh_token: refreshToken,
        },
      });

      if (!user) return res.sendStatus(403);

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) return res.sendStatus(403); // forbidden

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

          return res.json({ accessToken });
        }
      );
    } catch (error) {
      console.error(error);
      res.sendStatus(500); // server error
    }
  }
}

export default RefreshToken;
