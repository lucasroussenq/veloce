import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/login-page.component';
import { authGuard } from './core/auth/auth.guard';
import { OverviewPageComponent } from './features/overview/overview-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', canActivate: [authGuard], component: OverviewPageComponent },
  { path: '**', redirectTo: '' },
];
