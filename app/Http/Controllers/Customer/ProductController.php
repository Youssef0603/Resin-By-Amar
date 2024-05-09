<?php

namespace App\Http\Controllers\Customer;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Helpers\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Status;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\App\Product\ProductRepositoryInterface;
use App\Repositories\App\Media\MediaRepositoryInterface;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository,
        private readonly MediaRepositoryInterface $mediaRepository,

    ) {
    }

    public function index()
    {
        $categories = Category::query()->whereNull('parent_id')->get();
        return Inertia::render('WebApp/Products/Products', [
            'categories' => $categories
        ]);
    }

    public function list(Request $request)
    {
        try {
            $products = $this->productRepository->list($request);
            return Response::success('Success', $products);
        } catch (\Exception $e) {
            return Response::error(500, 'Internal Server Error', $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $product = Product::query()->with(['medias', 'status', 'category'])->find($id);
            return Inertia::render('WebApp/ProductDetails/ProductDetails', [
                'item' => $product
            ]);
        } catch (\Exception $e) {
            return Response::error(500, 'Internal Server Error', $e->getMessage());
        }
    }
    public function getProductsCategory(Request $request)
    {
        try {
            $products = $this->productRepository->getProductsCategory($request);
            return Response::success('Success', $products);
        } catch (\Exception $e) {
            return Response::error(500, 'Internal Server Error', $e->getMessage());
        }
    }
}
