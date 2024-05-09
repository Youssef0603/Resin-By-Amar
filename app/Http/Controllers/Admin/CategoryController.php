<?php

namespace App\Http\Controllers\Admin;

use Exception;
use Inertia\Inertia;
use App\Models\Category;
use App\Helpers\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
use App\Repositories\App\Media\MediaRepositoryInterface;
use App\Repositories\App\Category\CategoryRepositoryInterface;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository,
        private readonly MediaRepositoryInterface $mediaRepository,
    ) {
    }
    public function index()
    {
        return Inertia::render('Admin/Data/Category/Index');
    }

    public function list(Request $request)
    {
        try {
            $categories = $this->categoryRepository->list($request);
            return Response::success('Success', $categories);
        } catch (\Exception $e) {
            return Response::error(500, 'Internal Server Error', $e->getMessage());
        }
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render("Admin/Data/Category/Form", [
            'categories' => $categories,
        ]);
    }

    public function edit($id)
    {
        try {
            $categories = Category::all();
            $category = Category::query()->with(['media'])->find($id);
            return Inertia::render("Admin/Data/Category/Form", [
                'item' => $category,
                'categories' => $categories,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error_message' => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $data = $this->categoryRepository->destroy($id);
        return Response::success($data);
    }


    public function store(Request $request)
    {
        try {
            if ($request->parent_id == 'null' || $request->parent_id == null) {
                unset($request['parent_id']);
            }
            $data = $this->categoryRepository->updateOrCreate($request->all());
            if ($request->has('media')) {
                $mediaData = [
                    "media" => $request->media,
                    "mediable_id" => $data->id,
                    "mediable_type" => Category::class,
                ];

                $this->mediaRepository->storeMedia($mediaData);
            }

            return Redirect::route("admin.categories.index")->with(['success_message' => "Category Added/Updated."]);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error_message' => $e->getMessage()]);
        }
    }
}
