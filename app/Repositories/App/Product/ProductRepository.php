<?php

namespace App\Repositories\App\Product;

use App\Models\Product;
use App\Repositories\Base\BaseRepository;
use App\Repositories\App\Product\ProductRepositoryInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public $model = Product::class;

    public function __construct()
    {
    }
    public function getProductsCategory($request)
    {
        $products = Product::query()
            ->with(['medias', 'status'])
            ->where('category_id', $request->categoryId)
            ->where('id', '!=', $request->productId)
            ->orderBy('id', 'DESC')
            ->paginate(4);

        return $products;
    }
}
