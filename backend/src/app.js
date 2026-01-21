const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");
const commentsRoutes = require("./routes/comments.routes");
const savesRoutes = require("./routes/saves.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

// CORS configuration - Allow frontend origins
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://yumzy-frontend-f399.onrender.com",
    "https://yumzy-frontend-m2jh.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
// Ensure preflight requests are handled
app.options("*", cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/saves", savesRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
