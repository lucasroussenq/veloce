<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthEndpointTest extends TestCase
{
    public function test_health_endpoint_reports_application_and_database_status(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertOk()
            ->assertJsonStructure(['status', 'application', 'database', 'timestamp'])
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('application', 'ok')
            ->assertJsonPath('database', 'ok');
    }

    public function test_health_endpoint_reports_degraded_when_database_connection_fails(): void
    {
        config(['database.default' => 'missing']);

        $response = $this->getJson('/api/health');

        $response->assertStatus(503)
            ->assertJsonPath('status', 'degraded')
            ->assertJsonPath('database', 'unavailable');
    }
}
