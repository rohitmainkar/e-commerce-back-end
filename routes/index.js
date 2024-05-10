const router = require('express').Router();
const express = require('express');
const apiRoutes = require('./protected_api');
const protectedApi = require('./unprotected_api');
const verifyToken = require('../middleware/authenticateToken');
const path = require('path');
const cors = require('cors')

router.use('/api',cors(), apiRoutes,);
router.use('/autho',cors(), protectedApi);
// router.use(cors());


// Serve static files from the "uploads" folder
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  setHeaders: (res, filePath) => {
      res.setHeader('Content-Type', 'image/jpeg');
  }
}));


router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});


module.exports = router;