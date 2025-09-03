import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast-service';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
    protected loginForm = new FormGroup({
        username: new FormControl<string>('', {
            validators: [Validators.required],
            nonNullable: true
        }),
        password: new FormControl<string>('', {
            validators: [Validators.required],
            nonNullable: true
        })
    });

    protected loginInProgress = signal(false);

	constructor(
        protected router: Router,
        private authService: AuthService,
        private toastService: ToastService
    ) { }

    protected async loginUser() {
        this.loginForm.markAllAsTouched();

        if (this.loginForm.invalid || this.loginForm.pending) return;

        try {
            this.loginInProgress.set(true);
            const { username, password } = this.loginForm.getRawValue();
            await this.authService.login(username, password);
            this.router.navigateByUrl('');
        } catch (err) {
            if (err instanceof HttpErrorResponse) {
                this.toastService.showToast({title: `${err.status} API Error`, message: err.error.error, type: 'danger', autoHideDelay: 3000})
            } else {
                this.toastService.showToast({title: 'Unexpected Error', message: 'Unable to login, please try again later', type: 'danger', autoHideDelay: 3000})
            }
        } finally {
            this.loginInProgress.set(false);
        }
    }
}
