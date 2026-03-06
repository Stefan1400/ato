export interface Errors {
   email?: string,
   password?: string,
   terms?: string
};

export type RegisterRequest = {
   email: string;
   password: string;
};

export type User = {
   id: number;
   email: string;
};

export type AuthResponse = {
   user: User;
   token: string;
};