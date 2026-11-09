<?php

namespace App\Http\Controllers\Api;

use App\Models\Establishment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'establishment_name' => ['required', 'string', 'max:160'],
        ]);

        [$user, $establishment] = DB::transaction(function () use ($data): array {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            $establishment = Establishment::create([
                'name' => $data['establishment_name'],
                'slug' => $this->uniqueSlug($data['establishment_name']),
            ]);

            $user->establishments()->attach($establishment, ['role' => 'owner']);

            return [$user, $establishment];
        });

        $token = $user->createToken('web')->plainTextToken;

        return response()->json($this->payload($user->load('establishments'), $token), 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'As credenciais informadas são inválidas.']);
        }

        $token = $user->createToken('web')->plainTextToken;

        return response()->json($this->payload($user->load('establishments'), $token));
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($this->payload($request->user()->load('establishments')));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();
        Auth::forgetGuards();

        return response()->json([], 204);
    }

    private function payload(User $user, ?string $token = null): array
    {
        $payload = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'establishments' => $user->establishments->map(fn (Establishment $establishment): array => [
                'id' => $establishment->id,
                'name' => $establishment->name,
                'slug' => $establishment->slug,
                'role' => $establishment->pivot->role,
            ])->values()->all(),
        ];

        if ($token !== null) {
            $payload['token'] = $token;
        }

        return $payload;
    }

    private function uniqueSlug(string $name): string
    {
        $base = Str::slug($name) ?: 'estabelecimento';
        $slug = $base;
        $counter = 2;

        while (Establishment::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$counter++;
        }

        return $slug;
    }
}
