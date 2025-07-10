export interface LoginRequest {
  phone: string;
  name?: string;
}

export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    phone: string;
    name: string;
    email?: string;
  };
  tokens: AuthTokens;
}