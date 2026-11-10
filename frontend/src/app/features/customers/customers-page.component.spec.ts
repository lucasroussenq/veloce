import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CustomerService } from '../../core/api/customer.service';
import { CustomersPageComponent } from './customers-page.component';

describe('CustomersPageComponent', () => {
  let fixture: ComponentFixture<CustomersPageComponent>;
  let component: CustomersPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomersPageComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CustomerService, useValue: { list: () => of({ data: [] }) } },
      ],
    });
    fixture = TestBed.createComponent(CustomersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens a confirmation dialog before deleting a customer', () => {
    const customer = { id: 1, name: 'Lucas', email: null, phone: null };

    component.requestDeleteCustomer(customer);

    expect(component.pendingDelete?.type).toBe('customer');
    expect(component.pendingDelete?.name).toBe('Lucas');
  });
});
