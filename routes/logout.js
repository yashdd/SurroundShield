const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

// Add cookieParser middleware if using cookies for session management
router.use(cookieParser());

// Logout Route
router.get('/logout', (req, res) => {
  // If you're using a session, you can destroy the session here
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }

    // If you're using cookies, clear the authentication cookie
    res.clearCookie('auth_token'); // Adjust the cookie name as needed

    // Respond with a success message
    return res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;
