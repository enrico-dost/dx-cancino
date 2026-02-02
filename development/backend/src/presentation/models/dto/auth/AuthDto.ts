export interface LoginRequestDto {
  userId?: string;
  role?: string;
}

export interface RefreshTokenRequestDto {
  userId: string;
  role: string;
}

export interface AuthResponseDto {
  status: number;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: string;
    userId: string;
    role: string;
  };
}

export interface TokenResponseDto {
  token: string;
  tokenType: string;
  expiresIn: string;
  userId: string;
  role: string;
}
