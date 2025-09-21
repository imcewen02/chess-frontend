import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Account } from '../models/Account';
import { AppConstants } from '../app.constants';
import { jwtDecode } from "jwt-decode";
import { AuthToken } from '../models/AuthToken';
import { SocketService } from './socket-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
	private static readonly BASE_URL = "http://localhost:3000/api/accounts";

	constructor(
		private http: HttpClient,
		private socketSerive: SocketService
	) {}

	public async getAllAccounts(): Promise<Account[]> {
		const url = `${AccountService.BASE_URL}/`;
		const response = await firstValueFrom(this.http.get<Account[]>(url));
		return response;
	}

	public async getUsernameAvailable(username: string): Promise<boolean> {
		const url = `${AccountService.BASE_URL}/account/${encodeURIComponent(username)}/available`;
		const response = await firstValueFrom(this.http.get<{ usernameAvailable: boolean }>(url));
		return response.usernameAvailable;
	}

	public async createAccount(email: string, username: string, password: string, experience: 0 | 1 | 2 | 3): Promise<void> {
		const url = `${AccountService.BASE_URL}/register`;
		const payload = {email: email, username: username, password: password, experience: experience};
		const response = await firstValueFrom(this.http.post(url, payload));
	}

    public async login(username: string, password: string): Promise<void> {
        const url = `${AccountService.BASE_URL}/login`;
        const payload = {username: username, password: password};
        const response = await firstValueFrom(this.http.post<{ token: string }>(url, payload));
        localStorage.setItem(AppConstants.JWT_STORAGE_KEY, response.token);
		this.socketSerive.refresh();
    }

    public logout(): void {
        localStorage.removeItem(AppConstants.JWT_STORAGE_KEY);
		this.socketSerive.refresh();
    }

    public getLoggedInAccount(): Account | null {
        const token = localStorage.getItem(AppConstants.JWT_STORAGE_KEY)
        return token != null ? jwtDecode<AuthToken>(token).account : null;
    }

    public getAuthToken(): String | null {
        return localStorage.getItem(AppConstants.JWT_STORAGE_KEY);
    }
}