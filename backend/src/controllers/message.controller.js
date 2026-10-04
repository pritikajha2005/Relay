const Message = require("../models/message.model");

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { receiverId } = req.params;

        const senderId = req.userId;

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image,
        });

        await newMessage.save();

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = { sendMessage };