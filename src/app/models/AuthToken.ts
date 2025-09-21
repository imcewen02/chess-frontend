import { Account } from "./Account";

export interface AuthToken {
    account: Account;
    iat: number;
    exp: number;
}