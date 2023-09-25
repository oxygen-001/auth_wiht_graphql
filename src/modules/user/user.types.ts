import { Interface } from "readline";

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

export interface ForFile {
  createReadStream: any;
  fileName: string;
  mimeType: string;
  encoding: string;
}

export interface File {
  file?: ForFile;
  id: number;
}
