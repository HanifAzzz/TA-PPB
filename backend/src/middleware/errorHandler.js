function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  console.error('🔥 Server Error:', err.message, '\nStack:', err.stack);

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server. Silakan coba lagi.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = errorHandler;
