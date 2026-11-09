<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_creates_user_establishment_and_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Ana Costa',
            'email' => 'ana@example.test',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'establishment_name' => 'Lavagem Central',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email'], 'establishments' => [['id', 'name', 'role']]]);

        $this->assertDatabaseHas('users', ['email' => 'ana@example.test']);
        $this->assertDatabaseHas('establishments', ['name' => 'Lavagem Central']);
        $this->assertDatabaseHas('establishment_user', ['role' => 'owner']);
    }

    public function test_authenticated_user_can_read_me_and_logout(): void
    {
        $user = User::factory()->create(['password' => Hash::make('password123')]);
        $establishment = $user->establishments()->create(['name' => 'Lavagem Norte', 'slug' => 'lavagem-norte']);
        $user->establishments()->updateExistingPivot($establishment->id, ['role' => 'owner']);
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('user.email', $user->email)
            ->assertJsonPath('establishments.0.name', 'Lavagem Norte');

        $this->withToken($token)->postJson('/api/auth/logout')->assertNoContent();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->flushSession();
        $this->withToken($token)->getJson('/api/me')->assertUnauthorized();
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create(['email' => 'ana@example.test', 'password' => Hash::make('password123')]);

        $this->postJson('/api/auth/login', ['email' => 'ana@example.test', 'password' => 'wrong-password'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
    }
}
