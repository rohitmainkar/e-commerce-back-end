const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// Endpoint for all api/tags requests.

// GET request without id: respond with all tags.
// Also return the associated product data.
router.get('/', (req, res) => {
  try {
    const tagData = Tag.findAll({
      include: [{ model: Product}]
    });

    if (!tagData) {
      return res.status(404).json({message:"No tag with this ID can be found."});
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
