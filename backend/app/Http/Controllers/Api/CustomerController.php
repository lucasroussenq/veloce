<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use App\Support\TenantContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController
{
    public function index(Request $request, TenantContext $tenantContext): JsonResponse
    {
        $tenant = $tenantContext->resolve($request, $request->user());
        $customers = Customer::where('establishment_id', $tenant->id)
            ->withCount('vehicles')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $customers]);
    }

    public function store(Request $request, TenantContext $tenantContext): JsonResponse
    {
        $tenant = $tenantContext->resolve($request, $request->user());
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $data['establishment_id'] = $tenant->id;

        return response()->json(Customer::create($data), 201);
    }

    public function show(Request $request, int $customer, TenantContext $tenantContext): JsonResponse
    {
        $tenant = $tenantContext->resolve($request, $request->user());
        $record = Customer::where('establishment_id', $tenant->id)->with('vehicles')->findOrFail($customer);

        return response()->json($record);
    }
}
