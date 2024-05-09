<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Http\Request;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $flash = [];

        if ($request->session()->get('message')) {
            $flash['info'] = $request->session()->get('message');
        }

        if ($request->session()->get('error_message')) {
            $flash['error'] = $request->session()->get('error_message');
        }

        if ($request->session()->get('success_message')) {
            $flash['success'] = $request->session()->get('success_message');
        }
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'env' => [
                    'APP_ENV' => env('APP_ENV'),
                ]
            ],
            'flash' => $flash,
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
