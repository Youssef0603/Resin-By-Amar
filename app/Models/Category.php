<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Media;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends ListingModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'parent_id',
        'description',
        'active'
    ];

    protected $table = 'categories';

    protected $appends = ['value', 'label'];

    public function scopeListing($query, $status)
    {
        $query->with(['media']);
    }

    public function scopeSearch($query, $search)
    {
        if (isset($search)) {
            $query->whereAny(
                [
                    'name',
                ],
                'LIKE',
                "%$search%"
            );
        }
    }

    public function scopeFilter($query, $filters)
    {
        if (isset($filters)) {
            $query->when((isset($filters->created_at)), function ($q) use ($filters) {
                $createdDate = Carbon::parse($filters->created_at)->format('Y-m-d');
                $q->whereDate('created_at', $createdDate);
            });
        }
    }

    public function getValueAttribute()
    {
        return $this->id;
    }

    public function getLabelAttribute()
    {
        return $this->name;
    }
    public function media(): MorphOne
    {
        return $this->morphOne(Media::class, 'mediable');
    }
}
