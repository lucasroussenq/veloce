<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['establishment_id', 'customer_id', 'plate', 'model', 'color', 'year'])]
class Vehicle extends Model
{
    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
