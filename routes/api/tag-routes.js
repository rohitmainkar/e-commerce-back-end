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

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request with an id: respond with all data for given id.
// Also include data for associated product(s).
router.get('/:id', (req, res) => {
   try {
    const tagData = Tag.findByPk(req.params.id, {
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

// POST request: creates a new Tag with the request body data.
router.post('/', (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT request with id: update the tag with this id with the request body data.
router.put('/:id', (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);

    if (!tagData) {
      res.status(404).json({message: "No tag with this ID can be found."});
    }
    tagData.update(req.body);
    res.status(400).json(tagData);

  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE request with id: destroys the tag with this id, and all of its data.
router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
