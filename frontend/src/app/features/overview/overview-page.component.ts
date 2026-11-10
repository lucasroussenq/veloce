import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from '../../shared/layout/app-shell.component';
import { HealthResponse, HealthService } from '../../core/api/health.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'veloce-overview-page',
  standalone: true,
  imports: [CommonModule, AppShellComponent, RouterLink],
  templateUrl: './overview-page.component.html',
})
export class OverviewPageComponent implements OnInit {
  private readonly healthService = inject(HealthService);
  health: HealthResponse | null = null;
  loading = true;
  error = false;

  ngOnInit(): void {
    this.healthService.check().subscribe({
      next: (health) => { this.health = health; this.loading = false; },
      error: () => { this.loading = false; this.error = true; },
    });
  }
}
