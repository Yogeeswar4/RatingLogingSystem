const { Rating, Store } = require("../models/index");

exports.getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const rating = await Rating.findOne({
      where: { store_id: storeId, user_id: userId },
      attributes: ["rating", "comment", "createdAt", "updatedAt"],
    });

    if (!rating) {
      return res
        .status(404)
        .json({ message: "No rating found for this store" });
    }

    res.json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user rating", error });
  }
};
exports.submitRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { storeId } = req.params;
    const userId = req.user.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const existingRating = await Rating.findOne({
      where: { user_id: userId, store_id: storeId },
    });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.comment = comment;
      await existingRating.save();
      return res.status(200).json({
        message: "Rating updated successfully",
        rating: existingRating,
      });
    }

    const newRating = await Rating.create({
      user_id: userId,
      store_id: storeId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: newRating,
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting rating", error });
  }
};

exports.updateRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { storeId } = req.params;
    const userId = req.user.userId;

    const userRating = await Rating.findOne({
      where: { store_id: storeId, user_id: userId },
    });

    if (!userRating) {
      return res.status(404).json({
        message: "You have not rated this store yet. Submit a rating first.",
      });
    }

    await userRating.update({ rating, comment });

    res.json({ message: "Rating updated successfully", rating: userRating });
  } catch (error) {
    res.status(500).json({ message: "Error updating rating", error });
  }
};
exports.getUserStoreRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { store_id: req.user.userId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      attributes: ["rating", "comment", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching store ratings", error });
  }
};
exports.getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;

    const ratings = await Rating.findAll({ where: { store_id: storeId } });
    if (!ratings.length) {
      return res
        .status(404)
        .json({ message: "No ratings found for this store." });
    }

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving ratings", error });
  }
};
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;

    const userRating = await Rating.findOne({
      where: { id, user_id: req.user.userId },
    });
    if (!userRating) {
      return res.status(404).json({
        message: "Rating not found or you don't have permission to delete it.",
      });
    }

    await userRating.destroy();
    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rating", error });
  }
};
