//MIDDLEWARE USE WITH FRONTEND
// // Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }

  try {
    const decodedToken = await auth.currentUser.getIdToken(true) // Verify the token
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Error verifying token:', error)
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }
}

// // Apply the verifyToken middleware to all routes
