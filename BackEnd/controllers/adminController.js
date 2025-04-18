const { Op } = require("sequelize");
const { User, Store, Rating, sequelize } = require("../models/index");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    const storeRatings = await Rating.findAll({
      attributes: [
        "store_id",
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
      ],
      group: ["store_id"],
    });
    res.json({ totalUsers, totalStores, totalRatings, storeRatings });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    let filter = {};
    if (name) filter.name = { [Op.like]: `%${name}%` };
    if (email) filter.email = { [Op.like]: `%${email}%` };
    if (address) filter.address = { [Op.like]: `%${address}%` };
    if (role) filter.role = role;

    const users = await User.findAll({ where: filter });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
exports.getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;

    let filter = {};
    if (name) filter.name = { [Op.like]: `%${name}%` };
    if (email) filter.email = { [Op.like]: `%${email}%` };
    if (address) filter.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: filter,
      include: [
        {
          model: Rating,
          attributes: [
            [sequelize.fn("AVG", sequelize.col("rating")), "avg_rating"],
          ],
        },
      ],
      group: ["Store.id"],
    });

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stores", error });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const { userid } = req.params;

    const user = await User.findByPk(userid, {
      attributes: ["id", "name", "email", "address", "role"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "store_owner") {
      return res.json(user);
    }

    const stores = await Store.findAll({
      where: { owner_id: userid },
      attributes: [
        "id",
        "name",
        "address",
        [sequelize.fn("AVG", sequelize.col("Ratings.rating")), "avgRating"],
      ],
      include: [
        {
          model: Rating,
          attributes: [],
        },
      ],
      group: ["Store.id", "Store.name", "Store.address"],
    });

    return res.json({ ...user.toJSON(), stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
