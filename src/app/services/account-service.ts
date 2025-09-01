import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private static readonly BASE_URL = "http://localhost:3000/api/accounts";

    constructor(private http: HttpClient) {}

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
}