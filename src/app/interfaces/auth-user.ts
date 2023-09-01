export interface AuthUser {
  email: string;
  password: string;
  password2?: string;
}

export interface NewUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
