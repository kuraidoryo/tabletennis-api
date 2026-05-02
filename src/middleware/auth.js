module.exports = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Valid API key required in x-api-key header.'
    });
  }

  next();
};