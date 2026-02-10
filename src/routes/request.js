const express = require("express");
const requestRouter = express.Router();
const mongoose = require("mongoose");

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

/* ---------- SEND REQUEST (IGNORE / INTERESTED) ---------- */
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;

      /* STATUS CHECK */
      const allowedStatus = ["ignore", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }

      /* USER ID CHECK */
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw new Error("Invalid user id");
      }

      /* DUPLICATE CHECK (BOTH DIRECTIONS) */
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        throw new Error("Connection request already exists");
      }

      /* CREATE REQUEST */
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

/* ---------- ACCEPT REQUEST ---------- */
requestRouter.post(
  "/request/review/accepted/:requestId",
  userAuth,
  async (req, res) => {
    res.send("Request accepted");
  }
);

/* ---------- REJECT REQUEST ---------- */
requestRouter.post(
  "/request/review/rejected/:requestId",
  userAuth,
  async (req, res) => {
    res.send("Request rejected");
  }
);

module.exports = requestRouter;
