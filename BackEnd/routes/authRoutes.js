const express = require("express");
const {
  register,
  login,
  getProfile,
  changePassword,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/register",
  [
    body("name")
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be 20-60 characters"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be 8-16 characters"),
    body("role")
      .isIn(["admin", "user", "store_owner"])
      .withMessage("Invalid role"),
  ],
  register
);
router.put("/changepassword", authMiddleware, changePassword);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

module.exports = router;
