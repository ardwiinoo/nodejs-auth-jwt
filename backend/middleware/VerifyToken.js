import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // header
  const authHeader = req.headers["authorization"];
  // ambil token
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // forbidden

    req.email = decoded.email;
    next();
  });
};
