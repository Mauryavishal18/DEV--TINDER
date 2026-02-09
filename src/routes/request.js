const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

/* ---------- SEND INTEREST ---------- */
requestRouter.post(
  "/request/send/interested/:userId",
  userAuth,
  async (req, res) => {
    res.send(req.user.firstName + " sent connection request");
  }
);

/* ---------- IGNORE ---------- */
requestRouter.post(
  "/request/ignored/:userId",
  userAuth,
  async (req, res) => {
    res.send("Request ignored");
  }
);

/* ---------- ACCEPT ---------- */
requestRouter.post(
  "/request/review/accepted/:requestId",
  userAuth,
  async (req, res) => {
    res.send("Request accepted");
  }
);

/* ---------- REJECT ---------- */
requestRouter.post(
  "/request/review/rejected/:requestId",
  userAuth,
  async (req, res) => {
    res.send("Request rejected");
  }
);

module.exports = requestRouter;
