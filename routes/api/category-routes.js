const router = require("express").Router();
const { Category, Product } = require("../../models");

// GET request without id: retrieves all existing Category data.
// Also retrieves all associated products.
router.get("/", async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request with an id: retrieves Category data with specific id.
// Also retrieves all associated products.
router.get("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      return res
        .status(404)
        .json({ message: "No category found with this ID." });
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST request: creates a new Category with the  request body data.
router.post("/", async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT request with an id: updates this category with the request body data.
router.put("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id);

    if (!categoryData) {
      return res
        .status(404)
        .json({ message: "No category found with this ID." });
    }

    categoryData.update( req.body );
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE request with id: destroys the data for the category with this id.
router.delete("/:id", async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      }
    });

    if (!categoryData) {
      return res.status(404).json("No category with this ID exists to delete.");
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  };
});

module.exports = router;
