// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const generateToken = require('../../helpers/jwt');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // const isMatch = await bcrypt.compare(password, user.password);
    if (!user.passwordUser===password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;




