import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
//   res.send(token);
  if (token) {
    try {
        
      const decoded = jwt.verify(token, 'b562da53652ed82e645dcac1d2630c3e');
      req.userId = decoded._id;
      next();

    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};