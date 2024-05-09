<?php

namespace App\Repositories\App\Category;

use App\Models\Category;
use App\Repositories\Base\BaseRepository;
use App\Repositories\App\Category\CategoryRepositoryInterface;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    public $model = Category::class;

    public function __construct()
    {
    }
    
}
