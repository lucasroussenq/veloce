import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppShellComponent } from '../../shared/layout/app-shell.component';
import { Customer, CustomerService, Vehicle } from '../../core/api/customer.service';

type PendingDelete = { type: 'customer' | 'vehicle'; id: number; name: string; customerId?: number };

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
  editingCustomerId: number | null = null;
  editingVehicleId: number | null = null;
  pendingDelete: PendingDelete | null = null;
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
    const request = this.editingCustomerId === null
      ? this.customerService.create(this.customerForm.getRawValue())
      : this.customerService.update(this.editingCustomerId, this.customerForm.getRawValue());
    request.subscribe({
      next: (customer) => {
        this.customers = this.editingCustomerId === null
          ? [...this.customers, { ...customer, vehicles_count: 0 }].sort((a, b) => a.name.localeCompare(b.name))
          : this.customers.map((item) => item.id === customer.id ? { ...item, ...customer } : item);
        this.customerForm.reset();
        this.editingCustomerId = null;
        this.savingCustomer = false;
        this.selectCustomer(this.customers.find((item) => item.id === customer.id) ?? customer);
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
    const request = this.editingVehicleId === null
      ? this.customerService.createVehicle(this.selectedCustomer.id, this.vehicleForm.getRawValue())
      : this.customerService.updateVehicle(this.selectedCustomer.id, this.editingVehicleId, this.vehicleForm.getRawValue());
    request.subscribe({
      next: (vehicle) => {
        this.vehicles = this.editingVehicleId === null ? [...this.vehicles, vehicle] : this.vehicles.map((item) => item.id === vehicle.id ? vehicle : item);
        if (this.editingVehicleId === null) {
          this.customers = this.customers.map((customer) => customer.id === this.selectedCustomer?.id ? { ...customer, vehicles_count: (customer.vehicles_count ?? 0) + 1 } : customer);
        }
        this.vehicleForm.reset();
        this.editingVehicleId = null;
        this.savingVehicle = false;
      },
      error: () => { this.savingVehicle = false; this.errorMessage = 'Não foi possível salvar o veículo.'; },
    });
  }

  editCustomer(customer: Customer): void {
    this.editingCustomerId = customer.id;
    this.customerForm.patchValue({ name: customer.name, email: customer.email ?? '', phone: customer.phone ?? '' });
  }

  cancelCustomerEdit(): void {
    this.editingCustomerId = null;
    this.customerForm.reset();
  }

  requestDeleteCustomer(customer: Customer): void {
    this.pendingDelete = { type: 'customer', id: customer.id, name: customer.name };
  }

  editVehicle(vehicle: Vehicle): void {
    this.editingVehicleId = vehicle.id;
    this.vehicleForm.patchValue({ plate: vehicle.plate, model: vehicle.model, color: vehicle.color ?? '', year: vehicle.year });
  }

  cancelVehicleEdit(): void {
    this.editingVehicleId = null;
    this.vehicleForm.reset();
  }

  requestDeleteVehicle(vehicle: Vehicle): void {
    if (!this.selectedCustomer) {
      return;
    }

    this.pendingDelete = { type: 'vehicle', id: vehicle.id, name: vehicle.plate, customerId: this.selectedCustomer.id };
  }

  cancelDelete(): void {
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    const pending = this.pendingDelete;
    if (!pending) {
      return;
    }

    const request = pending.type === 'customer'
      ? this.customerService.remove(pending.id)
      : this.customerService.removeVehicle(pending.customerId as number, pending.id);

    request.subscribe({
      next: () => {
        if (pending.type === 'customer') {
          this.customers = this.customers.filter((item) => item.id !== pending.id);
          if (this.selectedCustomer?.id === pending.id) {
            this.selectedCustomer = null;
            this.vehicles = [];
          }
        } else {
          this.vehicles = this.vehicles.filter((item) => item.id !== pending.id);
          this.customers = this.customers.map((customer) => customer.id === this.selectedCustomer?.id ? { ...customer, vehicles_count: Math.max((customer.vehicles_count ?? 1) - 1, 0) } : customer);
        }
        this.pendingDelete = null;
      },
      error: () => { this.errorMessage = `Não foi possível excluir ${pending.type === 'customer' ? 'o cliente' : 'o veículo'}.`; this.pendingDelete = null; },
    });
  }

  private loadCustomers(): void {
    this.customerService.list().subscribe({
      next: (response) => { this.customers = response.data; this.loading = false; },
      error: () => { this.loading = false; this.errorMessage = 'Não foi possível carregar os clientes.'; },
    });
  }
}
