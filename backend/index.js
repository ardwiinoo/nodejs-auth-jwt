import express from "express";
import dotenv from "dotenv";
import db from "./config/Database.js";

// routes
import router from "./routes/api.js";

// init app
dotenv.config();
const app = express();

// agar bisa menerima request json
app.use(express.json());

// Database
try {
  await db.authenticate();
  console.info(`Database Connected...`);

  // jika tidak ada table di db, akan di migrate otomatis
  //   await User.sync();
} catch (error) {
  console.error(error);
}

app.use(router);

app.listen(5000, () => {
  console.info(`Server Running On Port 5000...`);
});
