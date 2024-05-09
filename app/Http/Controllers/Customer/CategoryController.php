<?php

namespace App\Http\Controllers\Customer;

use App\Helpers\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\App\Media\MediaRepositoryInterface;
use App\Repositories\App\Category\CategoryRepositoryInterface;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository,
        private readonly MediaRepositoryInterface $mediaRepository,
    ) {
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
    
}
