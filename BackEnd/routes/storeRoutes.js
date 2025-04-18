const express = require("express");
const {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
  getUnratedStores,
  getAllStores,
  getOwnerStores,
} = require("../controllers/storeController");
const {
  authMiddleware,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/owner",
  authMiddleware,
  authorizeRoles("store_owner"),
  getOwnerStores
);
router.get("/unrated", authMiddleware, getUnratedStores);
router.get("/", authMiddleware, getStores);
router.get("/user", authMiddleware, getAllStores);
router.get("/:id", getStoreById);

router.post("/", authMiddleware, authorizeRoles("admin"), createStore);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateStore);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteStore);

module.exports = router;
