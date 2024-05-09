<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Media extends ListingModel
{
    use HasFactory, SoftDeletes;
    
    protected $table= "media";

    protected $fillable = [
        'cdn',
        'size',
        'disk',
        'name',
        'active',
        'file_name',
        'mime_type',
        'file_hash',
        'collection',
        'created_by',
        'updated_by',
        'deleted_at',
        'mediable_id',
        'mediable_type',
    ];

    public function scopeListing($query,$status)
    {
        //
    }

    public function scopeSearch($query, $search)
    {
        // TODO: Implement scopeSearch() method.
    }

    public function scopeFilter($query, $filters)
    {
        // TODO: Implement scopeFilter() method.
    }

    public function scopeSaasListing($query, $ownerId)
    {
        // TODO: Implement scopeSaasListing() method.
    }

    public function scopeSaasSearch($query, $search, $userId, $platform, $organizationId, $providerId)
    {
        // TODO: Implement scopeSaasSearch() method.
    }

    public function scopeSaasFilter($query, $filters, $userId, $platform, $organizationId, $providerId)
    {
       
    }

    public function mediable()
    {
        return $this->morphTo();
    }

}
