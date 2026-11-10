<?php

namespace App\Support;

use App\Models\Establishment;
use App\Models\User;
use Illuminate\Http\Request;

class TenantContext
{
    public function resolve(Request $request, User $user): Establishment
    {
        $establishmentId = $request->header('X-Establishment-Id');
        $query = $user->establishments();
        $establishment = $establishmentId
            ? $query->whereKey($establishmentId)->first()
            : $query->first();

        abort_if($establishment === null, 403, 'Usuário não pertence ao estabelecimento informado.');

        return $establishment;
    }
}
