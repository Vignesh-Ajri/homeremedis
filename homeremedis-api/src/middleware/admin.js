const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_KEY;

  // Fail loudly at startup if the key is not set in production
  if (!expectedKey) {
    console.error('FATAL: ADMIN_KEY environment variable is not set.');
    return res.status(503).json({ message: 'Service misconfigured' });
  }

  if (adminKey === expectedKey) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Admin access required' });
  }
};

module.exports = adminAuth;
