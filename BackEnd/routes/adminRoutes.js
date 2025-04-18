const express = require("express");
const {
  getDashboardStats,
  getUsers,
  getStores,
  getUserDetails,
} = require("../controllers/adminController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("admin"),
  getDashboardStats
);
router.get("/users", authMiddleware, authorizeRoles("admin"), getUsers);
router.get("/stores", authMiddleware, authorizeRoles("admin"), getStores);
router.get(
  "/users/:userid",
  authMiddleware,
  authorizeRoles("admin"),
  getUserDetails
);

module.exports = router;
