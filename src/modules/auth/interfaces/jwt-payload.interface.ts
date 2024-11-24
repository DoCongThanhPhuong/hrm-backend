export interface IJwtPayload extends IPreJwtPayload {
  iat: number;
  exp: number;
}

export interface IJwtRefreshPayload {
  sub: string;
  issuedAt: number;
}

export interface IPreJwtPayload {
  sub: string;
  id: string;
  name: string;
  email: string;
  issuedAt: number;
}
