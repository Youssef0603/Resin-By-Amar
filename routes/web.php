<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Customer\CategoryController as CustomerCategoryController;
use App\Http\Controllers\Customer\HomeController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
    Route::middleware(['web', 'auth'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name("dashboard");

        //Categories
        Route::group(['prefix' => 'categories', 'as' => 'categories.'], function () {
            Route::get('list', [CategoryController::class, 'list'])->name('list');
        });
        Route::resource('categories', CategoryController::class);

        //Products
        Route::group(['prefix' => 'products', 'as' => 'products.'], function () {
            Route::get('list', [ProductController::class, 'list'])->name('list');
        });
        Route::resource('products', ProductController::class);
    });
});

//CustomerRoutes

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/listCategories', [CustomerCategoryController::class, 'list'])->name('categories');
Route::get('/listProducts', [CustomerProductController::class, 'list'])->name('products');
Route::group(['prefix' => 'products', 'as' => 'products.'], function () {
    Route::get('list', [CustomerProductController::class, 'list'])->name('list');
});
Route::resource('products', CustomerProductController::class);
Route::get('/getProductsCategory',[CustomerProductController::class,'getProductsCategory'])->name('get-products-category');
require __DIR__ . '/auth.php';
