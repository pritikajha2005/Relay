const express = require("express");
require("dotenv").config();

const connectDB = require("./lib/db");
const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => { console.log("API RUNNING");
    res.send("API Running");
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
    connectDB();
});