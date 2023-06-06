import jwt from "jsonwebtoken";

export interface JwtObject {
  userID: string;
}

export function jwtSign(obj: JwtObject) {
  return jwt.sign(obj, getJwtKey(), { expiresIn: "15d" });
}

// throws on error
export function jwtVerify(token: string) {
  return jwt.verify(token, getJwtKey()) as JwtObject;
}

function getJwtKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT Secret key not found");
    process.exit(1);
  }
  return secret;
}
