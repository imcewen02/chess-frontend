import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'signup-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-component.html',
  styleUrl: './signup-component.css'
})
export class SignupComponent {
    private static readonly ASCII_PRINTABLE_ONLY_REGEX = "^[!-~]+$";

    protected registrationInProgress = signal(false);

    protected signupForm = new FormGroup({
        experience: new FormControl<0 | 1 | 2 | 3>(0, {
            nonNullable: true
        }),
        email: new FormControl<string>('', {
            validators: [
                Validators.required, 
                Validators.email, 
                Validators.maxLength(256)
            ],
            nonNullable: true
        }),
        username: new FormControl<string>('', {
            validators: [
                Validators.required, 
                Validators.minLength(6), 
                Validators.maxLength(32), 
                Validators.pattern(SignupComponent.ASCII_PRINTABLE_ONLY_REGEX)
            ],
            asyncValidators: [
                this.usernameAvailableValidator()
            ],
            nonNullable: true
        }),
        password: new FormControl<string>('', {
            validators: [
                Validators.required, 
                Validators.minLength(8), 
                Validators.maxLength(32), 
                Validators.pattern(SignupComponent.ASCII_PRINTABLE_ONLY_REGEX)
            ],
            nonNullable: true
        }),
        confirmedPassword: new FormControl<string>('', {
            validators: [
                Validators.required
            ],
            nonNullable: true
        })
    }, { validators: this.passwordMismatchValidator() });

	constructor(
        protected router: Router,
        private accountService: AccountService,
        private toastService: ToastService
    ) { }

    protected async registerUser() {
        this.signupForm.markAllAsTouched();

        if (this.signupForm.invalid || this.signupForm.pending) return;

        try {
            this.registrationInProgress.set(true);
            const { email, username, password, experience } = this.signupForm.getRawValue();
            await this.accountService.createAccount(email, username, password, experience);
            await this.accountService.login(username, password);
            this.router.navigateByUrl('');
        } catch (err) {
            if (err instanceof HttpErrorResponse) {
                this.toastService.showToast({title: `${err.status} API Error`, message: err.error.error, type: 'danger', autoHideDelay: 3000})
            } else {
                this.toastService.showToast({title: 'Unexpected Error', message: 'Unable to create account, please try again later', type: 'danger', autoHideDelay: 3000})
            }
        } finally {
            this.registrationInProgress.set(false);
        }
    }

    /*START - Custom Validators*/
    private passwordMismatchValidator(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            return group.get('password')?.value == group.get('confirmedPassword')?.value ? null : { passwordMismatch: true };
        };
    }

    private usernameAvailableValidator(): AsyncValidatorFn {
        return async (control: AbstractControl): Promise<ValidationErrors | null> => {
            return await this.accountService.getUsernameAvailable(control.value) ? null : {usernameTaken: true};
        };
    }
    /*END - Custom Validators*/
}