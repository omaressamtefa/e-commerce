import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  InjectionToken,
  inject,
  NgZone,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-resetpassword',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss',
})
export class ResetpasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  steps: number = 1;
  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
    private ngZone: NgZone
  ) {}
  sendEmailForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  verifyCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\w{6}$/),
    ]),
  });

  resetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [Validators.required]),
  });
  verifyEmailSubmit(): void {
    let emailValue = this.sendEmailForm.get('email')?.value;
    this.resetPasswordForm.get('email')?.patchValue(emailValue);
    this.authService.setEmailVerify(this.sendEmailForm.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.statusMsg === 'success') {
          this.steps = 2;
          this.toastr.success(res.message, 'success', {
            progressBar: true,
            positionClass: 'toast-top-left',
            progressAnimation: 'increasing',
            closeButton: true,
            timeOut: 5000,
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  verifyCodeSubmit(): void {
    this.authService.setCodeVerify(this.verifyCodeForm.value).subscribe({
      next: (res) => {
        console.log(res);

        if (res.status === 'Success') {
          this.steps = 3;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  resetPasswordSubmit(): void {
    this.authService.setResetPass(this.resetPasswordForm.value).subscribe({
      next: (res) => {
        console.log('Full API Response:', res);
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          this.authService.sendUserData();
          this.toastr.success('Password reset successfully!', 'Success');

          console.log('🔄 Attempting navigation to /home...');
          this.ngZone.run(() => {
            this.router.navigate(['/home']).then((success) => {
              if (success) {
                console.log('✅ Navigation to /home successful');
              } else {
                console.error('❌ Navigation to /home failed');
              }
            });
          });
        } else {
          console.error('❌ No token received in API response:', res);
        }
      },
      error: (err) => {
        console.error('Error resetting password:', err);
      },
    });
  }
}
