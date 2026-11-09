import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'veloce-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  mode: 'login' | 'register' = 'login';
  loading = false;
  errorMessage = '';
  form = this.formBuilder.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: [''],
    establishment_name: [''],
  });

  setMode(mode: 'login' | 'register'): void {
    this.mode = mode;
    this.errorMessage = '';
    this.form.reset();
  }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid || (this.mode === 'register' && (!this.form.controls.name.value.trim() || !this.form.controls.establishment_name.value.trim()))) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const values = this.form.getRawValue();
    const request = this.mode === 'login'
      ? this.auth.login({ email: values.email, password: values.password })
      : this.auth.register({ ...values, name: values.name, establishment_name: values.establishment_name });

    request.subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error: { error?: { message?: string } }) => {
        this.loading = false;
        this.errorMessage = error.error?.message ?? 'Não foi possível concluir o acesso. Verifique os dados e tente novamente.';
      },
    });
  }
}
