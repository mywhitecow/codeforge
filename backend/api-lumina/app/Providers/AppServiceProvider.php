<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Course;
use App\Observers\CourseObserver; // <-- 1. Importamos el Observer

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // 2. Le ordenamos al modelo Course que sea vigilado por el Observer
        Course::observe(CourseObserver::class);
    }
}