import { Account } from "./account";

export interface AuthToken {
    account: Account;
    iat: number;
    exp: number;
}