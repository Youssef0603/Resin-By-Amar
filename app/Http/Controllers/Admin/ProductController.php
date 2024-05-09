<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Helpers\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Status;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\App\Product\ProductRepositoryInterface;
use App\Repositories\App\Category\CategoryRepositoryInterface;
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
        return Inertia::render('Admin/Data/Product/Index');
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

    public function create()
    {
        $statuses = Status::query()->where('tag', 'product')->get();
        $categories = Category::all();
        return Inertia::render("Admin/Data/Product/Form", [
            'statuses' => $statuses,
            'categories' => $categories
        ]);
    }

    public function edit($id)
    {
        try {
            $product = Product::query()->with(['medias'])->find($id);
            $statuses = Status::query()->where('tag', 'product')->get();
            $categories = Category::all();
            return Inertia::render("Admin/Data/Product/Form", [
                'item' => $product,
                'statuses' => $statuses,
                'categories' => $categories
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error_message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $data = $this->productRepository->destroy($id);
        return Response::success($data);
    }

    public function store(Request $request)
    {
        $data = $this->productRepository->updateOrCreate($request->all());
        try {
            if ($request->has('media')) {
                $mediaData = [
                    "media" => $request['media'],
                    "mediable_id" => $data->id,
                    "mediable_type" => Product::class,
                ];

                $this->mediaRepository->storeMedia($mediaData);
            }
            return Redirect::route("admin.products.index")->with(['success_message' => "Product Added/Updated."]);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error_message' => $e->getMessage()]);
        }
    }
}
