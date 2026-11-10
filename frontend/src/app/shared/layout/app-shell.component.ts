import { Component, Input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'veloce-app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  @Input() title = '';
  @Input() description = '';

  logout(): void {
    this.auth.logout().subscribe({ next: () => this.router.navigateByUrl('/login'), error: () => { this.auth.clearToken(); void this.router.navigateByUrl('/login'); } });
  }
}
