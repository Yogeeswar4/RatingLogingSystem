const { Store, Rating, User } = require("../models/index");
const { Op, Sequelize } = require("sequelize");
exports.createStore = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      ownerId,
      ownerName,
      ownerEmail,
      ownerPassword,
    } = req.body;

    let storeOwner = await User.findByPk(ownerId);

    if (!storeOwner && ownerName && ownerEmail && ownerPassword) {
      storeOwner = await User.create({
        name: ownerName,
        email: ownerEmail,
        password_hash: ownerPassword,
        address: address,
        role: "store_owner",
      });
    }

    if (!storeOwner) {
      return res.status(400).json({ message: "Store owner is required." });
    }
    const store = await Store.create({
      name,
      email,
      address,
      owner_id: storeOwner.dataValues.id,
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: "Error creating store", error });
  }
};
exports.getAllStores = async (req, res) => {
  try {
    const userId = req.user?.userId || null;

    const stores = await Store.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "address",
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("AVG", Sequelize.col("Ratings.rating")),
            0
          ),
          "avgRating",
        ],
      ],
      include: [
        { model: Rating, attributes: [], required: false },
        {
          model: Rating,
          as: "userRating",
          attributes: ["rating"],
          where: userId ? { user_id: userId } : undefined,
          required: false,
        },
      ],
      group: ["Store.id"],
    });

    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving stores", error });
  }
};
exports.getStores = async (req, res) => {
  try {
    const { name, email, address, sort } = req.query;
    const userId = req.user?.userId || null;

    let filter = {};
    if (name) filter.name = { [Op.like]: `%${name}%` };
    if (email) filter.email = { [Op.like]: `%${email}%` };
    if (address) filter.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where: filter,
      attributes: [
        "id",
        "name",
        "email",
        "address",
        [Sequelize.fn("AVG", Sequelize.col("Ratings.rating")), "avgRating"],
        [
          Sequelize.literal(
            `(SELECT rating FROM Ratings WHERE Ratings.store_id = Store.id AND Ratings.user_id = ${userId} LIMIT 1)`
          ),
          "userRating",
        ],
      ],
      include: [
        {
          model: Rating,
          attributes: [],
        },
      ],
      group: ["Store.id"],
      order: [
        [
          Sequelize.fn("AVG", Sequelize.col("Ratings.rating")),
          sort === "asc" ? "ASC" : "DESC",
        ],
      ],
    });

    res.json(stores);
  } catch (error) {
    console.error("Error retrieving stores:", error);
    res.status(500).json({ message: "Error retrieving stores", error });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving store", error });
  }
};
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    await store.update(req.body);
    res.json({ message: "Store updated successfully", store });
  } catch (error) {
    res.status(500).json({ message: "Error updating store", error });
  }
};
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });

    await store.destroy();
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting store", error });
  }
};
exports.getUnratedStores = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unratedStores = await Store.findAll({
      attributes: ["id", "name", "email", "address"],
      where: Sequelize.literal(
        "(SELECT COUNT(*) FROM Ratings WHERE Ratings.store_id = Store.id) = 0"
      ),
      limit: 5,
    });

    if (unratedStores.length === 0) {
      const notRatedByUser = await Store.findAll({
        attributes: ["id", "name", "email", "address"],
        where: Sequelize.literal(
          `(SELECT COUNT(*) FROM Ratings WHERE Ratings.store_id = Store.id AND Ratings.user_id = ${userId}) = 0`
        ),
        limit: 5,
      });

      return res.json(notRatedByUser);
    }

    res.json(unratedStores);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unrated stores", error });
  }
};

exports.getOwnerStores = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const stores = await Store.findAll({
      where: { owner_id: ownerId },
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ["id", "name", "email"] }],
        },
      ],
    });

    if (!stores || stores.length === 0) {
      return res.status(404).json({ message: "You do not own any stores" });
    }

    const storesWithAvgRating = stores.map((store) => {
      const avgRating =
        store.Ratings.length > 0
          ? store.Ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.Ratings.length
          : null;
      return { ...store.toJSON(), avgRating };
    });
    res.json(storesWithAvgRating);
  } catch (error) {
    res.status(500).json({ message: "Error fetching store details", error });
  }
};
