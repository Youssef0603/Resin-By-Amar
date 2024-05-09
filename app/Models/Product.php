<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Media;
use App\Models\Status;
use App\Models\Category;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends ListingModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'category_id',
        'status_id',
        'description',
        'cost',
        'price',
        'active'
    ];

    protected $table = 'products';

    protected $appends = ['value', 'label'];

    public function scopeListing($query, $status)
    {
        if ($status != null) {
            $query->whereHas('status', function ($query) use ($status) {
                $query->where('tag', 'product')
                    ->where('slug', $status);
            });
        }

        $query->with(['status', 'medias'])->get();
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
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
    public function medias(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }
}
