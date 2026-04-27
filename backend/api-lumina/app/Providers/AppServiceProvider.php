<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config; 
use App\Models\Course;
use App\Observers\CourseObserver;
// ------------------------------------------

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 2. Le ordenamos al modelo Course que sea vigilado por el Observer
        Course::observe(CourseObserver::class);

        // Cambiar la expiración del link de verificación a 15 minutos
        Config::set('auth.verification.expire', 15);
    }
}