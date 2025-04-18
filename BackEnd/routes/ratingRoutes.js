const express = require("express");
const {
  submitRating,
  getStoreRatings,
  updateRating,
  deleteRating,
  getUserRating,
  getUserStoreRatings,
} = require("../controllers/ratingController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:storeId", getStoreRatings);
router.get(
  "/",
  authMiddleware,
  authorizeRoles("store_owner"),
  getUserRating
);
router.get("/:storeId/user", authMiddleware, getUserRating);
router.post("/:storeId", authMiddleware, authorizeRoles("user"), submitRating);
router.put("/:storeId", authMiddleware, authorizeRoles("user"), updateRating);

router.delete("/:id", authMiddleware, authorizeRoles("user"), deleteRating);

module.exports = router;
