import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/login-page.component';
import { CustomersPageComponent } from './features/customers/customers-page.component';
import { authGuard } from './core/auth/auth.guard';
import { OverviewPageComponent } from './features/overview/overview-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'clientes', canActivate: [authGuard], component: CustomersPageComponent },
  { path: '', canActivate: [authGuard], component: OverviewPageComponent },
  { path: '**', redirectTo: '' },
];
