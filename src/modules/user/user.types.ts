export interface SignIn {
  username: string;
  password: string;
}

export interface SignUp extends SignIn {}

export interface ForToken {
  access_token: string;
}

export interface UserByUsername {
  username: string;
}
