export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
}

export interface UserCreate {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginRequest {
  username: string; // FastAPI OAuth2 uses 'username' field
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
