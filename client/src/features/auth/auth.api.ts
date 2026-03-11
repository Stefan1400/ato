import { api } from '../../lib/api';
import type { RegisterRequest, LoginRequest, AuthResponse, User, getUserRequest } from "./auth.types";

export function registerUser(data: RegisterRequest): Promise<AuthResponse> {   
   const response = api<AuthResponse>("/users/register", 'POST', data);
   
   return response;
};

export function loginUser(data: LoginRequest): Promise<AuthResponse> {
   const response = api<AuthResponse>("/users/login", "POST", data);
   
   return response;
};

export async function getUser(): Promise<User> {
   const response = await api<{ fetchedUser: User }>("/users/", "GET");
   
   return response.fetchedUser;
};