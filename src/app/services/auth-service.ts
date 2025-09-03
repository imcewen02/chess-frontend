import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private static readonly BASE_URL = "http://localhost:3000/api/auth";
    private static readonly CURRENT_USERNAME_KEY = "current_username"

	constructor(private http: HttpClient) {}

    public async login(username: string, password: string): Promise<void> {
        const url = `${AuthService.BASE_URL}/login`;
        const payload = {username: username, password: password};
        const response = await firstValueFrom(this.http.post(url, payload));
        localStorage.setItem(AuthService.CURRENT_USERNAME_KEY, username);
    }

    public logout(): void {
        localStorage.removeItem(AuthService.CURRENT_USERNAME_KEY);
    }

    public getCurrentUsername(): string | null {
        return localStorage.getItem(AuthService.CURRENT_USERNAME_KEY);
    }
}