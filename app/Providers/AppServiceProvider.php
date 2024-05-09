<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Base\BaseRepository;
use App\Repositories\Base\BaseRepositoryInterface;
use App\Repositories\App\Category\CategoryRepository;
use App\Repositories\App\Category\CategoryRepositoryInterface;
use App\Repositories\App\Media\MediaRepository;
use App\Repositories\App\Media\MediaRepositoryInterface;
use App\Repositories\App\Product\ProductRepository;
use App\Repositories\App\Product\ProductRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(BaseRepositoryInterface::class, BaseRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(MediaRepositoryInterface::class, MediaRepository::class);

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
