
const router = require("express").Router();
const { Category, SubCategory } = require("../../models");


// GET all subcategories
router.get("/", async (req, res) => {
  try {
    const subcategoryData = await SubCategory.findAll({
      include: [{ model: Category }],
    });
    res.status(200).json(subcategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET subcategories by id
router.get("/:id", async (req, res) => {
  try {
    const subcategoryData = await SubCategory.findAll({ where: { categoryId: req.params.id } });

    if (!subcategoryData || subcategoryData.length === 0) {
      return res
        .status(404)
        .json({ message: "No subcategories found with this category ID." });
    }

    res.status(200).json(subcategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// POST new subcategories
router.post("/", async (req, res) => {
  try {
    const subcategoryData = await SubCategory.create(req.body);
    res.status(200).json(subcategoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT update subcategories by id
router.put("/:id", async (req, res) => {
  try {
    const subcategoryData = await SubCategory.findByPk(req.params.id);

    if (!subcategoryData) {
      return res
        .status(404)
        .json({ message: "No subcategories found with this ID." });
    }

    await subcategoryData.update(req.body);
    res.status(200).json(subcategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE subcategories by id
router.delete("/:id", async (req, res) => {
  try {
    const subcategoryData = await SubCategory.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!subcategoryData) {
      return res
        .status(404)
        .json("No subcategories with this ID exists to delete.");
    }

    res.status(200).json(subcategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
