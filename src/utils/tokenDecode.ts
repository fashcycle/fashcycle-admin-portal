import { jwtDecode } from "jwt-decode";

export interface DecodedJWT {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * Decodes a JWT token into its payload.
 * @param token - JWT token string
 * @returns Decoded token object or null if no token is provided
 */
export const decodedToken = (token: string): DecodedJWT | null => {
  if (!token) return null;
  return jwtDecode<DecodedJWT>(token);
};
