import { api } from '../../lib/api';
import type { RegisterRequest, LoginRequest, AuthResponse } from "./auth.types";

export function registerUser(data: RegisterRequest): Promise<AuthResponse> {   
   const response = api<AuthResponse>("/users/register", 'POST', data);
   
   return response;
};

export function loginUser(data: LoginRequest): Promise<AuthResponse> {
   const response = api<AuthResponse>("/users/login", "POST", data);
   
   return response;
};