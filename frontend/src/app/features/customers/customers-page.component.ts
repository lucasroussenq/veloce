import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppShellComponent } from '../../shared/layout/app-shell.component';
import { Customer, CustomerService, Vehicle } from '../../core/api/customer.service';

@Component({
  selector: 'veloce-customers-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppShellComponent],
  templateUrl: './customers-page.component.html',
})
export class CustomersPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);

  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  selectedCustomer: Customer | null = null;
  loading = true;
  savingCustomer = false;
  savingVehicle = false;
  errorMessage = '';
  searchTerm = '';
  customerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(160)]],
    email: ['', [Validators.email]],
    phone: [''],
  });
  vehicleForm = this.formBuilder.nonNullable.group({
    plate: ['', [Validators.required, Validators.maxLength(10)]],
    model: ['', [Validators.required, Validators.maxLength(120)]],
    color: [''],
    year: [null as number | null],
  });

  get filteredCustomers(): Customer[] {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    if (!term) {
      return this.customers;
    }

    return this.customers.filter((customer) => [customer.name, customer.email, customer.phone].some((value) => value?.toLocaleLowerCase().includes(term)));
  }

  get customerCountLabel(): string {
    return `${this.customers.length} ${this.customers.length === 1 ? 'registro' : 'registros'}`;
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.vehicles = [];
    this.errorMessage = '';
    this.customerService.listVehicles(customer.id).subscribe({
      next: (response) => { this.vehicles = response.data; },
      error: () => { this.errorMessage = 'Não foi possível carregar os veículos deste cliente.'; },
    });
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.savingCustomer = true;
    this.errorMessage = '';
    this.customerService.create(this.customerForm.getRawValue()).subscribe({
      next: (customer) => {
        this.customers = [...this.customers, { ...customer, vehicles_count: 0 }].sort((a, b) => a.name.localeCompare(b.name));
        this.customerForm.reset();
        this.savingCustomer = false;
        this.selectCustomer(customer);
      },
      error: () => { this.savingCustomer = false; this.errorMessage = 'Não foi possível salvar o cliente.'; },
    });
  }

  saveVehicle(): void {
    if (!this.selectedCustomer || this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.savingVehicle = true;
    this.errorMessage = '';
    this.customerService.createVehicle(this.selectedCustomer.id, this.vehicleForm.getRawValue()).subscribe({
      next: (vehicle) => {
        this.vehicles = [...this.vehicles, vehicle];
        this.customers = this.customers.map((customer) => customer.id === this.selectedCustomer?.id ? { ...customer, vehicles_count: (customer.vehicles_count ?? 0) + 1 } : customer);
        this.vehicleForm.reset();
        this.savingVehicle = false;
      },
      error: () => { this.savingVehicle = false; this.errorMessage = 'Não foi possível salvar o veículo.'; },
    });
  }

  private loadCustomers(): void {
    this.customerService.list().subscribe({
      next: (response) => { this.customers = response.data; this.loading = false; },
      error: () => { this.loading = false; this.errorMessage = 'Não foi possível carregar os clientes.'; },
    });
  }
}
