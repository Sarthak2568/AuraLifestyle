import jwt from 'jsonwebtoken';

export default function requireAdmin(req, res, next) {
  try {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ success:false, message:'Missing token' });
    const p = jwt.verify(token, process.env.JWT_SECRET);
    if (p.role !== 'admin') return res.status(403).json({ success:false, message:'forbidden' });
    req.user = p;
    next();
  } catch {
    res.status(401).json({ success:false, message:'Invalid/expired token' });
  }
}
