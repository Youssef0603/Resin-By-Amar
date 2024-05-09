<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Status extends ListingModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tag',
        'slug',
        'active',
        'name',
    ];
    protected $table = 'statuses';
    protected $appends = ['value', 'label'];

    public function getLabelAttribute()
    {
        return $this->name_en;
    }

    public function getValueAttribute()
    {
        return $this->id;
    }
    public function scopeListing($query,$status)
    {
        // TODO: Implement scopeListing() method.
    }

    public function scopeSearch($query, $search)
    {
        // TODO: Implement scopeSearch() method.
    }

    public function scopeFilter($query, $filters)
    {
        // TODO: Implement scopeFilter() method.
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updated_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
