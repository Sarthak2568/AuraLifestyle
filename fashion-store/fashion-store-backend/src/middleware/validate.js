import { ZodError } from 'zod';

export default (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body ?? {});
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).json({ success:false, message:'invalid_body', issues:e.issues });
    }
    next(e);
  }
};
