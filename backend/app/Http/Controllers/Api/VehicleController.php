<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use App\Models\Vehicle;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehicleController
{
    public function index(Request $request, int $customer, TenantContext $tenantContext): JsonResponse
    {
        $customerRecord = $this->customer($request, $customer, $tenantContext);

        return response()->json(['data' => $customerRecord->vehicles()->orderBy('model')->get()]);
    }

    public function store(Request $request, int $customer, TenantContext $tenantContext): JsonResponse
    {
        $customerRecord = $this->customer($request, $customer, $tenantContext);
        $data = $request->validate([
            'plate' => ['required', 'string', 'max:10', 'unique:vehicles,plate'],
            'model' => ['required', 'string', 'max:120'],
            'color' => ['nullable', 'string', 'max:60'],
            'year' => ['nullable', 'integer', 'between:1950,2100'],
        ]);
        $data['plate'] = strtoupper(str_replace([' ', '-'], '', $data['plate']));
        $data['establishment_id'] = $customerRecord->establishment_id;
        $data['customer_id'] = $customerRecord->id;

        return response()->json(Vehicle::create($data), 201);
    }

    public function update(Request $request, int $customer, int $vehicle, TenantContext $tenantContext): JsonResponse
    {
        $record = $this->vehicle($request, $customer, $vehicle, $tenantContext);
        $data = $request->validate([
            'plate' => ['required', 'string', 'max:10', Rule::unique('vehicles', 'plate')->ignore($record->id)],
            'model' => ['required', 'string', 'max:120'],
            'color' => ['nullable', 'string', 'max:60'],
            'year' => ['nullable', 'integer', 'between:1950,2100'],
        ]);
        $data['plate'] = strtoupper(str_replace([' ', '-'], '', $data['plate']));
        $record->update($data);

        return response()->json($record->fresh());
    }

    public function destroy(Request $request, int $customer, int $vehicle, TenantContext $tenantContext): JsonResponse
    {
        $record = $this->vehicle($request, $customer, $vehicle, $tenantContext);
        $record->delete();

        return response()->json([], 204);
    }

    private function customer(Request $request, int $customer, TenantContext $tenantContext): Customer
    {
        $tenant = $tenantContext->resolve($request, $request->user());

        return Customer::where('establishment_id', $tenant->id)->findOrFail($customer);
    }

    private function vehicle(Request $request, int $customer, int $vehicle, TenantContext $tenantContext): Vehicle
    {
        $customerRecord = $this->customer($request, $customer, $tenantContext);

        return Vehicle::where('customer_id', $customerRecord->id)->findOrFail($vehicle);
    }
}
