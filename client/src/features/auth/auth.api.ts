import { api } from '../../lib/api';
import type { RegisterRequest, AuthResponse } from "./auth.types";

export function registerUser(data: RegisterRequest): Promise<AuthResponse> {   
   const response = api<AuthResponse>("/users/register", 'POST', data);
   
   return response;
};