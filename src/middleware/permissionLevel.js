const minimumPermissionLevelRequired = requiredPermissionLevel => async (req, res, next) => {
  try {
    if (req.decoded) {
      const userPermissionLevel = req.decoded.role;

      if (userPermissionLevel === requiredPermissionLevel) {
        next();
      }
    }
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden', message: error });
  }
};

export default minimumPermissionLevelRequired;
