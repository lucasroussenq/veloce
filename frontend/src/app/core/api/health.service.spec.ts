import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HealthService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(HealthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests the configured health endpoint', () => {
    service.check().subscribe();
    const request = http.expectOne('http://localhost:8000/api/health');
    expect(request.request.method).toBe('GET');
    request.flush({ status: 'ok', application: 'ok', database: 'ok', timestamp: '2026-11-09T00:00:00Z' });
  });
});
