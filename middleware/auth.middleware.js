import { verifyUserToken } from "../utils/token.js";




export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next();
  }
  if(!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid token missing Bearer" });
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyUserToken(token);

  req.user = payload;

  next();


  
}


export function ensureAuthenticated(req, res, next) {

  if(!req.user || !req.user.payload || !req.user.payload.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}