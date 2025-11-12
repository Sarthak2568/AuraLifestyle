// src/middleware/auth.js
import jwt from 'jsonwebtoken';

/** Extract Bearer token from Authorization header */
function getBearer(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : null;
}

/** Core auth verifier: sets req.user = { id, userId, role } */
function coreAuth(req, res, next) {
  try {
    const token = getBearer(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing token' });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.uid,
      userId: payload.userId,
      role: payload.role || 'user',
    };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid/expired token' });
  }
}

/** Named export: requireAuth (for routes that want a named import) */
export function requireAuth(req, res, next) {
  return coreAuth(req, res, next);
}

/**
 * Named export: requireRole('admin') or requireRole(['owner','admin'])
 * Wraps auth and then checks req.user.role
 */
export function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) =>
    coreAuth(req, res, () => {
      const role = req.user?.role || 'user';
      if (!allowed.includes(role)) {
        return res.status(403).json({ success: false, message: 'Admin only' });
      }
      next();
    });
}

/** Default export kept for backwards compatibility */
export default function auth(req, res, next) {
  return coreAuth(req, res, next);
}
