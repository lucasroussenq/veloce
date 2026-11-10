import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  notes?: string | null;
  vehicles_count?: number;
}

export interface Vehicle {
  id: number;
  customer_id: number;
  plate: string;
  model: string;
  color: string | null;
  year: number | null;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/customers`;

  list(): Observable<{ data: Customer[] }> {
    return this.http.get<{ data: Customer[] }>(this.baseUrl);
  }

  create(payload: Pick<Customer, 'name' | 'email' | 'phone'>): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, payload);
  }

  update(customerId: number, payload: Pick<Customer, 'name' | 'email' | 'phone'>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${customerId}`, payload);
  }

  remove(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${customerId}`);
  }

  listVehicles(customerId: number): Observable<{ data: Vehicle[] }> {
    return this.http.get<{ data: Vehicle[] }>(`${this.baseUrl}/${customerId}/vehicles`);
  }

  createVehicle(customerId: number, payload: Omit<Vehicle, 'id' | 'customer_id'>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.baseUrl}/${customerId}/vehicles`, payload);
  }

  updateVehicle(customerId: number, vehicleId: number, payload: Omit<Vehicle, 'id' | 'customer_id'>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${customerId}/vehicles/${vehicleId}`, payload);
  }

  removeVehicle(customerId: number, vehicleId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${customerId}/vehicles/${vehicleId}`);
  }
}
