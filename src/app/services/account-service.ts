import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { AppConstants } from '../app.constants';
import { Account } from '../models/account';
import { AuthToken } from '../models/authToken';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
	private static readonly BASE_URL = "http://localhost:3000/api/accounts";

	public loggedInAccount = signal<Account | null>(this.getStoredAccount());

	constructor(
		private http: HttpClient
	) {

	}

	/**
	 * Gets all accounts on the site
	 * 
	 * @returns all current accounts
	 */
	public async getAllAccounts(): Promise<Account[]> {
		const url = `${AccountService.BASE_URL}/`;
		const response = await firstValueFrom(this.http.get<Account[]>(url));
		return response;
	}

	/**
	 * Checks if the input username is available or taken
	 * 
	 * @param username the username to check
	 * 
	 * @returns wether the username is available
	 */
	public async getUsernameAvailable(username: string): Promise<boolean> {
		const url = `${AccountService.BASE_URL}/account/${encodeURIComponent(username)}/available`;
		const response = await firstValueFrom(this.http.get<{ usernameAvailable: boolean }>(url));
		return response.usernameAvailable;
	}

	/**
	 * Retrieves the active game for a given account
	 * 
	 * @param username the username to fetch the active game for
	 * 
	 * @returns the active game of the user (if any)
	 */
	public async getAccountsActiveGame(username: string): Promise<Game | null> {
		const url = `${AccountService.BASE_URL}/account/${encodeURIComponent(username)}/game`;
		const response = await firstValueFrom(this.http.get<{ game: Game | null }>(url));
		return response.game;
	}

	/**
	 * Attempts to create a new account
	 * 
	 * @param username the username for the new account
	 * @param password the plaintext password for the new account
	 * @param experience the relative expierence of the new account
	 */
	public async createAccount(username: string, password: string, experience: 0 | 1 | 2 | 3): Promise<void> {
		const url = `${AccountService.BASE_URL}/register`;
		const payload = {username: username, password: password, experience: experience};
		const response = await firstValueFrom(this.http.post(url, payload));
	}

	/**
	 * Attempts to log the user in
	 * On success stores the returned jwt in storage and resets the socket connection
	 * 
	 * @param username the username to login
	 * @param password the plaintext password used for the login attempt
	 */
    public async login(username: string, password: string): Promise<void> {
        const url = `${AccountService.BASE_URL}/login`;
        const payload = {username: username, password: password};
        const response = await firstValueFrom(this.http.post<{ token: string }>(url, payload));
        localStorage.setItem(AppConstants.JWT_STORAGE_KEY, response.token);
		this.loggedInAccount.set(this.getStoredAccount());
    }

	/**
	 * Logs the current user out, resetting the socket connection
	 */
    public logout(): void {
        localStorage.removeItem(AppConstants.JWT_STORAGE_KEY);
		this.loggedInAccount.set(null);
    }

	/**
	 * Gets the current logged in account by decoding the jwt in local storage
	 * 
	 * @returns the current account, or null if the user is not logged in
	 */
    private getStoredAccount(): Account | null {
        const token = localStorage.getItem(AppConstants.JWT_STORAGE_KEY)
        return token != null ? jwtDecode<AuthToken>(token).account : null;
    }
}