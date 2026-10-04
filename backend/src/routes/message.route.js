const express = require("express");
const { sendMessage } = require("../controllers/message.controller");
const protectRoute = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/send/:receiverId", protectRoute, sendMessage);

module.exports = router;