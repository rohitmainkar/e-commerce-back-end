const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

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

router.post("/", async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

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

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
});

// router.delete('/:id', async (req, res) => {
//   try {
//     const locationData = await Location.destroy({
//       where: {
//         id: req.params.id
//       }
//     });

//     if (!locationData) {
//       res.status(404).json({ message: 'No location found with this id!' });
//       return;
//     }

//     res.status(200).json(locationData);
//   } catch (err) {
//     res.status(500).json(err);
//   }

module.exports = router;
