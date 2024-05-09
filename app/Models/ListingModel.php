<?php

namespace App\Models;

use Illuminate\Support\Facades\App;
use Illuminate\Database\Eloquent\Model;

abstract class ListingModel extends Model
{
    public abstract function scopeListing($query, $status);

    public abstract function scopeSearch($query, $search);

    public abstract function scopeFilter($query, $filters);



    // public function trans($text)
    // {
    //     $locale = App::getLocale();

    //     if ($locale == 'en') {
    //         return $this->{$text};
    //     }

    //     $column = $text . '_' . $locale;

    //     if ($this->{$column} == null) {
    //         return $this->{$text};
    //     }

    //     return $this->{$column};
    // }
}
