<?php

namespace Tests\Feature;

use App\Models\Establishment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerVehicleApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_is_created_and_visible_only_to_its_establishment(): void
    {
        [$owner, $establishment] = $this->tenant('Lavagem Central', 'central@example.test');

        $response = $this->actingAs($owner, 'sanctum')
            ->withHeader('X-Establishment-Id', (string) $establishment->id)
            ->postJson('/api/customers', ['name' => 'Lucas Roussenq', 'phone' => '41999999999']);

        $response->assertCreated()->assertJsonPath('name', 'Lucas Roussenq');
        $this->assertDatabaseHas('customers', ['name' => 'Lucas Roussenq', 'establishment_id' => $establishment->id]);

        [$otherOwner, $otherEstablishment] = $this->tenant('Lavagem Norte', 'north@example.test');
        $this->actingAs($otherOwner, 'sanctum')
            ->withHeader('X-Establishment-Id', (string) $otherEstablishment->id)
            ->getJson('/api/customers')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_vehicle_is_created_under_a_customer_and_cannot_cross_tenant(): void
    {
        [$owner, $establishment] = $this->tenant('Lavagem Central', 'central@example.test');
        $customer = $this->actingAs($owner, 'sanctum')
            ->withHeader('X-Establishment-Id', (string) $establishment->id)
            ->postJson('/api/customers', ['name' => 'Ana Costa'])
            ->json();

        $this->actingAs($owner, 'sanctum')
            ->withHeader('X-Establishment-Id', (string) $establishment->id)
            ->postJson('/api/customers/'.$customer['id'].'/vehicles', [
                'plate' => 'ABC1D23',
                'model' => 'Toyota Corolla',
                'color' => 'Prata',
            ])
            ->assertCreated()
            ->assertJsonPath('plate', 'ABC1D23');

        [$otherOwner, $otherEstablishment] = $this->tenant('Lavagem Norte', 'north@example.test');
        $this->actingAs($otherOwner, 'sanctum')
            ->withHeader('X-Establishment-Id', (string) $otherEstablishment->id)
            ->getJson('/api/customers/'.$customer['id'].'/vehicles')
            ->assertNotFound();
    }

    public function test_customer_creation_requires_authentication_and_name(): void
    {
        $this->postJson('/api/customers', [])->assertUnauthorized();

        [$owner, $establishment] = $this->tenant('Lavagem Central', 'central@example.test');
        $this->actingAs($owner, 'sanctum')
            ->withHeader('X-Establishment-Id', (string) $establishment->id)
            ->postJson('/api/customers', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_customer_can_be_updated_and_deleted_with_its_vehicles(): void
    {
        [$owner, $establishment] = $this->tenant('Lavagem Central', 'central@example.test');
        $headers = ['X-Establishment-Id' => (string) $establishment->id];
        $customer = $this->actingAs($owner, 'sanctum')->withHeaders($headers)
            ->postJson('/api/customers', ['name' => 'Nome antigo'])
            ->json();

        $this->actingAs($owner, 'sanctum')->withHeaders($headers)
            ->putJson('/api/customers/'.$customer['id'], ['name' => 'Nome atualizado', 'phone' => '41988888888'])
            ->assertOk()
            ->assertJsonPath('name', 'Nome atualizado');

        $vehicle = $this->actingAs($owner, 'sanctum')->withHeaders($headers)
            ->postJson('/api/customers/'.$customer['id'].'/vehicles', ['plate' => 'DEF4G56', 'model' => 'Honda Civic'])
            ->json();

        $this->actingAs($owner, 'sanctum')->withHeaders($headers)
            ->deleteJson('/api/customers/'.$customer['id'])
            ->assertNoContent();

        $this->assertDatabaseMissing('customers', ['id' => $customer['id']]);
        $this->assertDatabaseMissing('vehicles', ['id' => $vehicle['id']]);
    }

    public function test_vehicle_can_be_updated_and_deleted_only_inside_current_tenant(): void
    {
        [$owner, $establishment] = $this->tenant('Lavagem Central', 'central@example.test');
        $headers = ['X-Establishment-Id' => (string) $establishment->id];
        $customer = $this->actingAs($owner, 'sanctum')->withHeaders($headers)
            ->postJson('/api/customers', ['name' => 'Ana Costa'])
            ->json();
        $vehicle = $this->actingAs($owner, 'sanctum')->withHeaders($headers)
            ->postJson('/api/customers/'.$customer['id'].'/vehicles', ['plate' => 'GHI7J89', 'model' => 'Fiat Pulse'])
            ->json();

        $this->actingAs($owner, 'sanctum')->withHeaders($headers)
            ->putJson('/api/customers/'.$customer['id'].'/vehicles/'.$vehicle['id'], ['plate' => 'GHI7J89', 'model' => 'Fiat Pulse Audace', 'color' => 'Azul'])
            ->assertOk()
            ->assertJsonPath('model', 'Fiat Pulse Audace');

        [$otherOwner, $otherEstablishment] = $this->tenant('Lavagem Norte', 'north@example.test');
        $this->actingAs($otherOwner, 'sanctum')->withHeaders(['X-Establishment-Id' => (string) $otherEstablishment->id])
            ->deleteJson('/api/customers/'.$customer['id'].'/vehicles/'.$vehicle['id'])
            ->assertNotFound();

        $this->actingAs($owner, 'sanctum')->withHeaders($headers)
            ->deleteJson('/api/customers/'.$customer['id'].'/vehicles/'.$vehicle['id'])
            ->assertNoContent();
    }

    private function tenant(string $name, string $email): array
    {
        $user = User::factory()->create(['email' => $email]);
        $establishment = Establishment::create(['name' => $name, 'slug' => strtolower(str_replace(' ', '-', $name))]);
        $user->establishments()->attach($establishment, ['role' => 'owner']);

        return [$user, $establishment];
    }
}
